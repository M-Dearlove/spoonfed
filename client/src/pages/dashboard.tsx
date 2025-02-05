import React, { useState, ChangeEvent, FormEvent } from 'react';
import RecipeCard from '../components/Recipecard';
import { searchRecipes } from '../services/RecipeService';
import { Recipe } from '../interfaces/recipe';



// Common ingredients list
const availableIngredients = [
  'Chicken',
  'Rice',
  'Tomatoes',
  'Onions',
  'Garlic',
  'Bell Peppers',
  'Pasta',
  'Ground Beef',
  'Potatoes',
  'Carrots',
];

const Dashboard: React.FC = () => {
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    try {
      setIsLoading(true);
      // Search for recipes with updated ingredients
      const recipesData = await searchRecipes(selectedIngredients);
      setRecipes(recipesData);
    } catch (error) {
      console.error('Failed to search recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Spoon Fed</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Ingredients:</h2>
        <form onSubmit={handleAddIngredient} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentIngredient}
              onChange={handleIngredientChange}
              placeholder="Enter an ingredient"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              list="ingredients-list"
            />
            <datalist id="ingredients-list">
              {availableIngredients.map((ingredient) => (
                <option key={ingredient} value={ingredient} />
              ))}
            </datalist>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {selectedIngredients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Ingredients:</h2>
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
          
          <button
            onClick={handleSearch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search Recipes
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} recipeId={''} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;