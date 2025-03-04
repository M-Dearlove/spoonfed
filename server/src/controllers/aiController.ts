// controllers/recipeController.ts
import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define interfaces for query parameters
interface RecipeQueryParams {
  ingredients: string;
  cuisine: string;
  cookingTime: string;
  complexity: string;
  people: string;
  note?: string;
}

// Define interface for OpenAI chunk
interface OpenAIChunk {
  choices: {
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

// Recipe streaming controller
export const getRecipeStream = (req: Request<{}, {}, {}, RecipeQueryParams>, res: Response): void => {
  const { ingredients, cuisine, cookingTime, complexity, people, note } = req.query;
  
  // Log the request
  console.log('Recipe stream request:', { ingredients, cuisine, cookingTime, complexity, people, note });
  
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  
  // Function to send messages
  const sendEvent = (chunk: OpenAIChunk): void => {
    if (chunk.choices[0].finish_reason === "stop") {
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    } else {
      const content = chunk.choices[0].delta.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ action: "chunk", chunk: content })}\n\n`);
      }
    }
  };
  
  // Include the note if provided by the user
  const customNote = note ? `Please ensure the recipe meets the following requirement: ${note}.` : "";
  
  // Update the prompt to let the AI consider the note if it exists
  const prompt = `Generate a recipe in a structured plain text format with a suitable name for the dish based on the given ingredients, cuisine, and other details. The dish name should be in the native language of the cuisine (use correct characters, not transliteration), followed by its English translation in parentheses. The output should be formatted in a visually appealing way, with specific sections in bold as described below.${customNote}---**How to Make [Native Dish Name in Original Script] ([English Translation]) - ${cuisine} Style**This recipe is for ${people} servings and takes around ${cookingTime}. Complexity: ${complexity}.**Recipe at a Glance:**- Cooking Time: ${cookingTime}- Complexity: ${complexity}- Serves: ${people}- Main Ingredients: ${ingredients}**Ingredients You'll Need:**- List each ingredient in a clear format, specifying quantities where possible.**Step-by-Step Instructions:**1. Provide each cooking step in a numbered format.2. Include specific steps for cooking the primary ingredient (${ingredients.split(",")[0]}).**Nutritional Summary (per serving):**- Calories: [calories in kcal]- Carbohydrates: [amount in grams]- Proteins: [amount in grams]- Fats: [amount in grams]**Tips for a Perfect Dish:**- Include helpful cooking tips, such as optimal flavor combinations or cooking techniques.---The response should use bold headings as specified and be in plain text format. Avoid any markdown syntax or code blocks.`;
  
  const messages = [
    { 
      role: "system" as const, 
      content: "You are a recipe assistant that provides structured recipes in plain text format with bold headings, including a nutritional summary per serving." 
    },
    { 
      role: "user" as const, 
      content: prompt 
    },
  ];
  
  // Call the OpenAI stream function
  fetchOpenAICompletionsStream(messages, sendEvent).catch(error => {
    console.error('Error in recipe stream:', error);
    res.write(`data: ${JSON.stringify({ action: "error", message: "An error occurred while generating the recipe" })}\n\n`);
    res.end();
  });
  
  // Handle client disconnection
  req.on("close", () => {
    console.log('Client disconnected from recipe stream');
    res.end();
  });
};

// OpenAI streaming function
async function fetchOpenAICompletionsStream(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  callback: (chunk: OpenAIChunk) => void
): Promise<void> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: messages,
      temperature: 1,
      stream: true,
    });
    
    for await (const chunk of completion) {
      callback(chunk as unknown as OpenAIChunk);
    }
  } catch (error) {
    console.error("Error fetching data from OpenAI API:", error);
    throw error;
  }
}