import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

const AI_API_TOKEN = "5340f30fc1f04beeb25bf65d2d72a92c"

interface RecipeRequest {
  ingredients: string
  category?: string
  language?: string
}

interface AIRecipeResponse {
  title: string
  description: string
  ingredients: string[]
  instructions: string
  calories: number
  nutrition: {
    protein: string
    carbs: string
    fat: string
    fiber: string
    [key: string]: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, category = "general", language = "en" }: RecipeRequest = await request.json()

    if (!ingredients || ingredients.trim().length === 0) {
      return NextResponse.json({ error: "Ingredients are required" }, { status: 400 })
    }

    // Create prompt for AI based on language
    const prompts = {
      en: `Create a healthy recipe using these ingredients: ${ingredients}. ${category !== "general" ? `The recipe should be suitable for: ${category}.` : ""} 
      
      Please respond with a JSON object containing:
      - title: Recipe name
      - description: Brief description (1-2 sentences)
      - ingredients: Array of ingredients with measurements
      - instructions: Step-by-step cooking instructions
      - calories: Estimated calories per serving
      - nutrition: Object with protein, carbs, fat, fiber values
      
      Make it healthy and nutritious.`,
      es: `Crea una receta saludable usando estos ingredientes: ${ingredients}. ${category !== "general" ? `La receta debe ser adecuada para: ${category}.` : ""}
      
      Por favor responde con un objeto JSON que contenga:
      - title: Nombre de la receta
      - description: Descripción breve (1-2 oraciones)
      - ingredients: Array de ingredientes con medidas
      - instructions: Instrucciones paso a paso para cocinar
      - calories: Calorías estimadas por porción
      - nutrition: Objeto con valores de proteína, carbohidratos, grasa, fibra
      
      Hazla saludable y nutritiva.`,
      de: `Erstelle ein gesundes Rezept mit diesen Zutaten: ${ingredients}. ${category !== "general" ? `Das Rezept sollte geeignet sein für: ${category}.` : ""}
      
      Bitte antworte mit einem JSON-Objekt, das enthält:
      - title: Rezeptname
      - description: Kurze Beschreibung (1-2 Sätze)
      - ingredients: Array von Zutaten mit Mengenangaben
      - instructions: Schritt-für-Schritt Kochanweisungen
      - calories: Geschätzte Kalorien pro Portion
      - nutrition: Objekt mit Protein-, Kohlenhydrat-, Fett-, Ballaststoffwerten
      
      Mache es gesund und nahrhaft.`,
      zh: `使用这些食材创建一个健康食谱：${ingredients}。${category !== "general" ? `食谱应该适合：${category}。` : ""}
      
      请用包含以下内容的JSON对象回复：
      - title: 食谱名称
      - description: 简短描述（1-2句话）
      - ingredients: 带有用量的食材数组
      - instructions: 逐步烹饪说明
      - calories: 每份估计卡路里
      - nutrition: 包含蛋白质、碳水化合物、脂肪、纤维值的对象
      
      让它健康营养。`,
      ar: `أنشئ وصفة صحية باستخدام هذه المكونات: ${ingredients}. ${category !== "general" ? `يجب أن تكون الوصفة مناسبة لـ: ${category}.` : ""}
      
      يرجى الرد بكائن JSON يحتوي على:
      - title: اسم الوصفة
      - description: وصف مختصر (جملة أو جملتان)
      - ingredients: مصفوفة من المكونات مع القياسات
      - instructions: تعليمات الطبخ خطوة بخطوة
      - calories: السعرات الحرارية المقدرة لكل حصة
      - nutrition: كائن بقيم البروتين والكربوهيدرات والدهون والألياف
      
      اجعلها صحية ومغذية.`,
      bs: `Kreiraj zdrav recept koristeći ove sastojke: ${ingredients}. ${category !== "general" ? `Recept treba biti prikladan za: ${category}.` : ""}
      
      Molim odgovori sa JSON objektom koji sadrži:
      - title: Naziv recepta
      - description: Kratak opis (1-2 rečenice)
      - ingredients: Niz sastojaka sa mjerama
      - instructions: Korak-po-korak uputstva za kuvanje
      - calories: Procenjene kalorije po porciji
      - nutrition: Objekat sa vrijednostima proteina, ugljenih hidrata, masti, vlakana
      
      Učini ga zdravim i hranjivim.`,
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.en

    // Call AI API (using a generic AI endpoint - you may need to adjust this based on your AI service)
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_TOKEN}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist and chef. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`)
    }

    const aiData = await aiResponse.json()
    const recipeContent = aiData.choices[0].message.content

    // Parse the AI response
    let recipeData: AIRecipeResponse
    try {
      recipeData = JSON.parse(recipeContent)
    } catch (parseError) {
      console.error("Failed to parse AI response:", recipeContent)
      throw new Error("Invalid AI response format")
    }

    // Save to database
    const supabase = createServerClient()
    const { data: savedRecipe, error: dbError } = await supabase
      .from("recipes")
      .insert({
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        calories: recipeData.calories,
        nutrition: recipeData.nutrition,
        category,
        language,
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
    console.error("Recipe generation error:", error)
    return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 })
  }
}
