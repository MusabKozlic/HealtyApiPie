import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import OpenAI from "openai"
import { error } from "console"

interface RecipeRequest {
  ingredients: string
  category?: string
  servings?: number
  cookingTime?: number
  userId: string
}

interface Ingredient {
  name: string
  measurement?: string
}

interface AIRecipeResponse {
  title: string
  description: string
  ingredients: (string | Ingredient)[]
  instructions: string[]
  calories: string | number
  budget?: string | number
  imageUrl?: string | null
  nutrition: {
    protein: string
    carbs: string
    fat: string
    fiber: string
    [key: string]: string
  }
}

const client = new OpenAI({
  apiKey: process.env.AI_API_TOKEN,
  baseURL: "https://api.aimlapi.com/v1",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { ingredients, category = "general", servings, cookingTime, userId }: RecipeRequest = await request.json()

    if (!ingredients || ingredients.trim().length === 0) {
      return NextResponse.json({ error: "At least one parameter is required" }, { status: 400 })
    }

    const prompt = `
Create a healthy recipe with these specifications: ${ingredients}

${servings ? `This recipe should serve ${servings} people.` : ""}
${cookingTime ? `Cooking time should be approximately ${cookingTime} minutes.` : ""}

CRITICAL REQUIREMENTS:
1. If specific ingredients are mentioned, use ONLY those ingredients plus basic seasonings (salt, pepper, herbs, spices) or you can mention other optional seasonings.
2. Do NOT add ingredients that weren't specified by the user
3. If no specific ingredients are given, create a recipe based on the dietary/cuisine preferences mentioned
4. Respond ONLY in English
5. If user mention something unhealthy, remove it if recipe make sense without it or give the best healty option for that recipe.
6. Cooking time should be approximately to ${cookingTime} minutes, for example if user select 15min then it should be 15min +/- 5min.
7. Return ONLY a JSON object with this exact schema:

{
  "title": "string",                        // Recipe name in English
  "description": "string",                  // 1–2 sentence description in English
  "ingredients": [                          // Array of ingredient strings with measurements
    "2 cups spinach",
    "1 tbsp olive oil",
    "100g chicken breast"
  ],
  "instructions": [                         // Array of step-by-step cooking instructions in English
    "Step 1: Preheat the oven to 180°C.",
    "Step 2: Wash and chop the spinach."
  ],
  "calories": 450,                          // Estimated calories per serving, integer only
  "budget": 8.50,                           // Estimated cost per serving in USD (number only)
  "nutrition": {                            // Nutritional values per serving
    "protein": "25g",                       
    "carbs": "40g",                         
    "fat": "12g",                           
    "fiber": "5g"                           
  }
}

⚠️ STRICT RULES:
- calories field: integer only (e.g., 450), no text
- budget field: number only (e.g., 8.50), no currency symbols
- ingredients: array of strings only, not objects
- instructions: array of strings, each prefixed with "Step X:"
- ALL TEXT must be in English
- Respond ONLY with the JSON, no markdown blocks or extra text
- If user specified ingredients, do NOT add others except seasonings
    `

    console.log("Generating recipe with prompt:", prompt.substring(0, 200) + "...")

    const completion = await client.chat.completions.create({
      model: "openai/gpt-5-chat-latest",
      messages: [
        {
          role: "system",
          content: `You are a professional nutritionist and chef. 
          Always respond ONLY with a valid JSON object in English. 
          Do not include explanations, text, or Markdown formatting. 
          Every field must strictly follow the required format.
          If ingredients are specified, use ONLY those ingredients plus basic seasonings.
          

          If ingredients are unhealthy (like chocolate, pork, alcohol, soda, fried foods, candy, processed meats) 
          OR if the input is unrelated to food/recipes (random text, nonsense, non-food queries), 
          then respond ONLY with this exact JSON:

          {
            "title": "Cannot generate healthy recipe",
            "description": "",
            "ingredients": [],
            "instructions": [],
            "calories": "",
            "budget": "",
            "nutrition": {
              "protein": "",
              "carbs": "",
              "fat": "",
              "fiber": ""
            },
            "imageUrl": null
          }
          `,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const recipeContent = completion.choices[0].message.content ?? ""

    if (!recipeContent) {
      throw new Error("AI returned empty content")
    }

    // Parse the AI response
    let recipeData: AIRecipeResponse
    try {
      const sanitized = sanitizeAIResponse(recipeContent)
      const parsed = JSON.parse(sanitized)
      recipeData = normalizeRecipe(parsed)
    } catch (parseError) {
      console.error("Failed to parse AI response:", recipeContent)
      throw new Error("Invalid AI response format")
    }

    if(recipeData.title === "Cannot generate healthy recipe") {
      return NextResponse.json(recipeData, { status: 400 })
    }

    // Generate recipe image
    // Generate recipe image using AI/ML API
    let imageUrl: string | null = null
    try {
      const imagePrompt = `
      High-quality, realistic food photography of:
      "${recipeData.title}".
      Description: ${recipeData.description}

      Guidelines:
      - Show the final plated dish styled for a cookbook or food blog
      - Natural lighting, vibrant colors, appetizing composition
      - No text, watermarks, or extra objects
      - Photorealistic, not cartoonish
`

      const response = await fetch("https://api.aimlapi.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          model: "dall-e-3",
          size: "1024x1024",
        }),
      })

      const result = await response.json()

      if (result.data && result.data[0]?.url) {
        const imageBuffer = await fetch(result.data[0].url).then((res) => res.arrayBuffer())
        const safeTitle = recipeData.title
          .normalize("NFD")                 // normalize accented characters
          .replace(/[\u0300-\u036f]/g, "") // remove accents
          .replace(/[^a-zA-Z0-9-_]/g, "_") // replace invalid characters with underscore
          .toLowerCase()

        const fileName = `recipes/${safeTitle}_${Date.now()}.png`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("recipes")
          .upload(fileName, Buffer.from(imageBuffer), {
            contentType: "image/png",
          })

        if (uploadError) {
          console.error("Supabase storage upload error:", uploadError)
        } else {
          const { data: { publicUrl } } = supabase.storage.from("recipes").getPublicUrl(fileName)

          imageUrl = publicUrl
          recipeData.imageUrl = imageUrl
          console.log("Public image URL:", imageUrl)
        }
      }
    } catch (err) {
      console.error("Error generating image:", err)
    }


    const { data: savedRecipe, error: dbError } = await supabase
      .from("recipes")
      .insert({
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        calories: recipeData.calories,
        budget: recipeData.budget,
        nutrition: recipeData.nutrition,
        category,
        language: "en", // Always English now
        imageurl: recipeData.imageUrl || null,
        created_by: userId,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to save recipe")
    }

    return NextResponse.json({
      success: true,
      recipe: savedRecipe,
    })
  } catch (error) {
    console.log("Recipe generation error:", error)
    return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 })
  }
}

// Utility to fix common JSON issues from LLMs
function sanitizeAIResponse(response: string): string {
  let fixed = response.trim()

  // Remove markdown code block wrappers if present
  if (fixed.startsWith("```")) {
    fixed = fixed.replace(/```(json)?/g, "").trim()
  }

  // Fix unquoted unit values like: protein: 45 g → protein: "45g"
  fixed = fixed.replace(/:\s*(\d+)\s*(g|mg|kcal)(?=[,\s}])/gi, ': "$1$2"')

  // Ensure object keys are quoted properly
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')

  // Remove trailing commas that break JSON
  fixed = fixed.replace(/,(\s*[}\]])/g, "$1")

  return fixed
}

function normalizeRecipe(data: any): AIRecipeResponse {
  // Normalize instructions
  let instructions: string[] = []
  if (Array.isArray(data.instructions)) {
    instructions = data.instructions.map((step: string, i: number) =>
      step.trim().match(/^step\s*\d+/i) ? step.trim() : `Step ${i + 1}: ${step.trim()}`,
    )
  } else if (typeof data.instructions === "string" && data.instructions.trim() !== "") {
    const parts = data.instructions.split(/\n|\d+\.\s+/).filter(Boolean)
    instructions = parts.map((step: string, i: number) => `Step ${i + 1}: ${step.trim()}`)
  }

  return {
    title: data.title || "",
    description: data.description || "",
    ingredients: Array.isArray(data.ingredients)
      ? data.ingredients.map((ing: any) => {
        if (typeof ing === "string") return ing
        if (typeof ing === "object" && ing.name) {
          return `${ing.name}${ing.measurement ? ` - ${ing.measurement}` : ""}`
        }
        return String(ing)
      })
      : [],
    instructions,
    calories: typeof data.calories === "number" ? data.calories : String(data.calories || ""),
    budget: typeof data.budget === "number" ? data.budget : String(data.budget || ""),
    nutrition: data.nutrition || {},
  }
}
