import React, { useState, ChangeEvent, FormEvent } from 'react';
import RecipeList from '../components/RecipeList';

import { Recipe } from '../interfaces/recipe';



const RecipeSearch: React.FC = () => {
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentIngredient(e.target.value);
  };

  const handleAddIngredient = (e: FormEvent) => {
    e.preventDefault();
    if (currentIngredient.trim() && !selectedIngredients.includes(currentIngredient.trim())) {
      setSelectedIngredients([...selectedIngredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };


  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ingredients: selectedIngredients })
      });
      
      

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setRecipes(data.recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Spoonfed</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-8">
        <form onSubmit={handleAddIngredient} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentIngredient}
              onChange={handleIngredientChange}
              placeholder="Enter an ingredient"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </form>

        {selectedIngredients.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Selected Ingredients:</h2>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-2"
                >
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(ingredient)}
                    className="text-green-800 hover:text-green-900 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={selectedIngredients.length === 0 || isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Find Recipes'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <RecipeList recipes={recipes} />
      )}
    </div>
  );
};

export default RecipeSearch;