import React, { useState, useRef, useEffect } from "react";
import RecipeDisplay from "../components/aiRecipeCard";
import Hero from "../components/aiHero";
import "./App.css";

// Define types for recipe data and event stream
interface RecipeData {
  [key: string]: string | number | boolean; // You can adjust this depending on the exact structure of the data
}

const AiRecipePage: React.FC = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [recipeText, setRecipeText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const recipeDisplayRef = useRef<HTMLDivElement | null>(null); // Reference to RecipeDisplay

  useEffect(() => {
    return () => closeEventStream();
  }, []);

  useEffect(() => {
    if (recipeData) { 
      closeEventStream();
      initializeEventStream();
      recipeDisplayRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll into view on recipe data change
    }
  }, [recipeData]);

  const initializeEventStream = () => {
    if (!recipeData) return;

    const queryParams = new URLSearchParams(recipeData as Record<string, string>).toString();
    const url = `https://recipegenerator-n26b.onrender.com/recipeStream?${queryParams}`;
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
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

  const closeEventStream = () => {
    if (eventSourceRef.current) eventSourceRef.current.close();
  };

  const handleRecipeSubmit = (data: RecipeData) => {
    setRecipeData(data);
    setRecipeText(''); // Clear previous recipe text
    setError(null); // Clear previous error
  };

  return (
    <div className="bg-gray-100">
      <Hero onRecipeSubmit={handleRecipeSubmit} />
      <div ref={recipeDisplayRef}> {/* Add reference here */}
        <RecipeDisplay error={error} recipeText={recipeText} />
      </div>
    </div>
  );
}

export default AiRecipePage;
