import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0"
import { createServerClient } from "@/lib/supabase/server"
import OpenAI from "openai"

interface RecipeRequest {
  ingredients: string
  category?: string
  language?: string
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
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.sub

    // Check daily generation limit
    const supabase = createServerClient()
    const today = new Date().toISOString().split("T")[0]

    const { data: limitData, error: limitError } = await supabase
      .from("user_generation_limits")
      .select("generation_count")
      .eq("user_id", userId)
      .eq("generation_date", today)
      .single()

    if (limitError && limitError.code !== "PGRST116") {
      console.error("Error checking generation limit:", limitError)
      return NextResponse.json({ error: "Failed to check generation limit" }, { status: 500 })
    }

    const currentCount = limitData?.generation_count || 0
    if (currentCount >= 5) {
      return NextResponse.json(
        {
          error: "Daily generation limit reached. You can generate up to 5 recipes per day.",
        },
        { status: 429 },
      )
    }

    const { ingredients, category = "general", language = "en" }: RecipeRequest = await request.json()

    if (!ingredients || ingredients.trim().length === 0) {
      return NextResponse.json({ error: "Ingredients are required" }, { status: 400 })
    }

    // Create prompt for AI based on language
    const prompts = {
      en: `
      Create a healthy recipe using these ingredients: {ingredients}. 
${category !== "general" ? `The recipe should be suitable for: ${category}.` : ""}

Return ONLY a JSON object with the following schema:

{
  "title": "string",                        // Recipe name
  "description": "string",                  // 1–2 sentence description
  "ingredients": [                          // Array of ingredient strings with measurements
    "2 cups spinach",
    "1 tbsp olive oil",
    "100g chicken breast"
  ],
  "instructions": [                         // Array of step-by-step cooking instructions
    "Step 1: Preheat the oven to 180°C.",
    "Step 2: Wash and chop the spinach."
  ],
  "calories": 450,                          // Estimated calories per serving, integer only (e.g. 450)
  "budget": 8.50,                           // Estimated cost per serving in USD (e.g. 8.50)
  "nutrition": {                            // Nutritional values per serving
    "protein": "25g",                       // e.g. "25g"
    "carbs": "40g",                         // e.g. "40g"
    "fat": "12g",                           // e.g. "12g"
    "fiber": "5g"                           // e.g. "5g"
  }
}

⚠️ Important rules:
- Do NOT add words like "approximately", "per serving", or "calories" in the calories field — only an integer (e.g., 450).
- Do NOT add currency symbols or words in the budget field — only a number (e.g., 8.50).
- ingredients must always be an array of strings (not objects).
- instructions must always be an array of strings, each step prefixed with "Step X:".
- Respond ONLY with the JSON. No Markdown code blocks, no extra text.

      `,
      es: `Crea una receta saludable usando estos ingredientes: ${ingredients}. ${category !== "general" ? `La receta debe ser adecuada para: ${category}.` : ""}

      Por favor responde con un objeto JSON que contenga:
      - title: Nombre de la receta
      - description: Descripción breve (1-2 oraciones)
      - ingredients: Array de ingredientes con medidas
      - instructions: Instrucciones paso a paso para cocinar
      - calories: Calorías estimadas por porción
      - budget: Costo estimado por porción en USD
      - nutrition: Objeto con valores de proteína, carbohidratos, grasa, fibra

      Hazla saludable y nutritiva.`,
      de: `Erstelle ein gesundes Rezept mit diesen Zutaten: ${ingredients}. ${category !== "general" ? `Das Rezept sollte geeignet sein für: ${category}.` : ""}

      Bitte antworte mit einem JSON-Objekt, das enthält:
      - title: Rezeptname
      - description: Kurze Beschreibung (1-2 Sätze)
      - ingredients: Array von Zutaten mit Mengenangaben
      - instructions: Schritt-für-Schritt Kochanweisungen
      - calories: Geschätzte Kalorien pro Portion
      - budget: Geschätzte Kosten pro Portion in USD
      - nutrition: Objekt mit Protein-, Kohlenhydrat-, Fett-, Ballaststoffwerten

      Mache es gesund und nahrhaft.`,
      zh: `使用这些食材创建一个健康食谱：${ingredients}。${category !== "general" ? `食谱应该适合：${category}。` : ""}

      请用包含以下内容的JSON对象回复：
      - title: 食谱名称
      - description: 简短描述（1-2句话）
      - ingredients: 带有用量的食材数组
      - instructions: 逐步烹饪说明
      - calories: 每份估计卡路里
      - budget: 每份估计成本（美元）
      - nutrition: 包含蛋白质、碳水化合物、脂肪、纤维值的对象

      让它健康营养。`,
      ar: `أنشئ وصفة صحية باستخدام هذه المكونات: ${ingredients}. ${category !== "general" ? `يجب أن تكون الوصفة مناسبة لـ: ${category}.` : ""}

      يرجى الرد بكائن JSON يحتوي على:
      - title: اسم الوصفة
      - description: وصف مختصر (جملة أو جملتان)
      - ingredients: مصفوفة من المكونات مع القياسات
      - instructions: تعليمات الطبخ خطوة بخطوة
      - calories: السعرات الحرارية المقدرة لكل حصة
      - budget: التكلفة المقدرة لكل حصة بالدولار الأمريكي
      - nutrition: كائن بقيم البروتين والكربوهيدرات والدهون والألياف

      اجعلها صحية ومغذية.`,
      bs: `Kreiraj zdrav recept koristeći ove sastojke: ${ingredients}. ${category !== "general" ? `Recept treba biti prikladan za: ${category}.` : ""}

      Molim odgovori sa JSON objektom koji sadrži:
      - title: Naziv recepta
      - description: Kratak opis (1-2 rečenice)
      - ingredients: Niz sastojaka sa mjerama
      - instructions: Korak-po-korak uputstva za kuvanje
      - calories: Procenjene kalorije po porciji
      - budget: Procenjene troškove po porciji u USD
      - nutrition: Objekat sa vrijednostima proteina, ugljenih hidrata, masti, vlakana

      Učini ga zdravim i hranjivim.`,
    }

    console.log("Selected language:", language)

    const prompt = prompts[language as keyof typeof prompts] || prompts.en

    // Call AI/ML API instead of OpenAI
    const completion = await client.chat.completions.create({
      model: "openai/gpt-5-chat-latest",
      messages: [
        {
          role: "system",
          content: `You are a professional nutritionist and chef. 
          Always respond ONLY with a valid JSON object. 
          Do not include explanations, text, or Markdown formatting. 
          Every field must strictly follow the required format.`,
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
      console.error("Failed to parse AI response even after sanitizing:", recipeContent)
      throw new Error("Invalid AI response format")
    }

    // Save to database
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
        language,
        user_id: userId, // Adding user tracking
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to save recipe")
    }

    await supabase.from("user_generation_limits").upsert({
      user_id: userId,
      generation_date: today,
      generation_count: currentCount + 1,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      recipe: savedRecipe,
      remainingGenerations: 4 - currentCount, // Returning remaining generations
    })
  } catch (error) {
    console.log("Recipe generation error:", error)
    return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 })
  }
}

// Utility to try to fix common JSON issues from LLMs
function sanitizeAIResponse(response: string): string {
  let fixed = response.trim()

  // Remove markdown code block wrappers if present
  if (fixed.startsWith("```")) {
    fixed = fixed.replace(/```(json)?/g, "").trim()
  }

  // ✅ Fix unquoted unit values like: protein: 45 g → protein: "45g"
  fixed = fixed.replace(/:\s*(\d+)\s*(g|mg|kcal)(?=[,\s}])/gi, ': "$1$2"')

  // ✅ Ensure object keys are quoted properly
  // e.g. nutrition: { protein: 16 } → "nutrition": { "protein": 16 }
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')

  // ✅ Remove trailing commas that break JSON
  // e.g. { "a": 1, "b": 2, } → { "a": 1, "b": 2 }
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
    // Split by line breaks or numbered list
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
