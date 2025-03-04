import React, { useState, useRef, useEffect } from "react";
import RecipeDisplay from "../components/aiRecipeCard";
import Hero from "../components/aiHero";
import "../styles/AiRecipePage.css";

// Define RecipeFormData interface locally to match the one in aiHero.tsx
interface RecipeFormData {
  ingredients: string;
  mealType: string;
  cuisine: string;
  cookingTime: string;
  complexity: string;
  people: string;
  note: string;
}

// Define types for recipe data
interface RecipeData {
  [key: string]: string | number | boolean;
}

// Define type for event data
interface RecipeStreamEvent {
  action?: string;
  chunk?: string;
}

/**
 * AI Recipe Page Component
 */
const AiRecipePage: React.FC = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [recipeText, setRecipeText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const recipeDisplayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => closeEventStream();
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream();
      initializeEventStream();
      // Scroll into view on recipe data change
      recipeDisplayRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipeData]);

  const initializeEventStream = (): void => {
    if (!recipeData) return;

    const queryParams = new URLSearchParams();
    Object.entries(recipeData).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    const url = `https://recipegenerator-n26b.onrender.com/recipeStream?${queryParams.toString()}`;
    
    eventSourceRef.current = new EventSource(url);
    
    eventSourceRef.current.onmessage = (event: MessageEvent) => {
      const data: RecipeStreamEvent = JSON.parse(event.data);
      
      if (data.action === 'close') {
        closeEventStream();
      } else if (data.chunk) {
        setRecipeText((prev) => prev + data.chunk);
      }
    };

    eventSourceRef.current.onerror = (error: Event) => {
      console.error('Error:', error);
      setError('Connection issue.');
      closeEventStream();
    };
  };

  const closeEventStream = (): void => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  };

  // Modified to accept RecipeFormData instead of FormData
  const handleRecipeSubmit = (formData: RecipeFormData): void => {
    const data: RecipeData = {};
    Object.entries(formData).forEach(([key, value]) => {
      data[key] = value;
    });
    setRecipeData(data);
    setRecipeText(''); // Clear previous recipe text
    setError(null); // Clear previous error
  };

  return (
    <div className="recipe-page">
      <Hero onRecipeSubmit={handleRecipeSubmit} />
      <div ref={recipeDisplayRef} className="recipe-display-container">
        <RecipeDisplay error={error} recipeText={recipeText} />
      </div>
    </div>
  );
};

export default AiRecipePage;