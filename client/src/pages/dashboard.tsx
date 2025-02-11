import React, { useState, ChangeEvent, FormEvent } from 'react';
import RecipeCard from '../components/Recipecard';
import { searchRecipes } from '../services/RecipeService';
import { Recipe } from '../interfaces/recipe';
import '../styles/dashboard.css';

const availableIngredients = [
  'Chicken', 'Rice', 'Tomatoes', 'Onions', 'Garlic',
  'Bell Peppers', 'Pasta', 'Ground Beef', 'Potatoes',
  'Carrots', 'Apples',
];

const Dashboard: React.FC = () => {
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
    try {
      setIsLoading(true);
      setError(null);
      const recipesData = await searchRecipes(selectedIngredients);
      setRecipes(recipesData);
    } catch (error) {
      console.error('Failed to search recipes:', error);
      setError('Failed to search recipes');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
  
      if (!userId) {
        setError('Please log in to save recipes');
        return;
      }
  
      // Determine food group
      const recipeWithFoodGroup = {
        ...recipe,
        foodGroup: determineFoodGroup(recipe.ingredients)
      };
  
      const response = await fetch('/api/user/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          recipe: recipeWithFoodGroup
        })
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to save recipe');
      }
  
      setError('Recipe saved successfully!');
      setTimeout(() => setError(null), 2000);
  
    } catch (error) {
      console.error('Failed to save recipe:', error);
      setError(error instanceof Error ? error.message : 'Failed to save recipe');
      setTimeout(() => setError(null), 2000);
    }
  };

  const determineFoodGroup = (ingredients: string[]): string => {
    const lowerIngredients = ingredients.map(i => i.toLowerCase());
    
    if (lowerIngredients.some(i => ['chicken', 'beef', 'fish', 'pork', 'meat'].some(meat => i.includes(meat)))) {
      return 'Protein';
    }
    if (lowerIngredients.some(i => ['milk', 'cheese', 'yogurt', 'cream'].some(dairy => i.includes(dairy)))) {
      return 'Dairy';
    }
    if (lowerIngredients.some(i => ['apple', 'banana', 'orange', 'berry', 'fruit'].some(fruit => i.includes(fruit)))) {
      return 'Fruits';
    }
    if (lowerIngredients.some(i => ['carrot', 'broccoli', 'spinach', 'vegetable'].some(veg => i.includes(veg)))) {
      return 'Vegetables';
    }
    if (lowerIngredients.some(i => ['rice', 'pasta', 'bread', 'wheat', 'grain'].some(grain => i.includes(grain)))) {
      return 'Grains';
    }
    return 'Other';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Recipe Explorer</h1>
        <p className="text-description">Your personalized Cookbook </p>
      </div>
      
      {error && (
        <div className={`message ${error.includes('successfully') ? 'success' : 'error'}`}>
          <p>{error}</p>
        </div>
      )}

      <div className="search-bar-container">
        <form onSubmit={handleAddIngredient}>
          <div className="input-group">
            <input
              type="text"
              value={currentIngredient}
              onChange={handleIngredientChange}
              placeholder="Enter an ingredient"
              list="ingredients-list"
            />
            <datalist id="ingredients-list">
              {availableIngredients.map((ingredient) => (
                <option key={ingredient} value={ingredient} />
              ))}
            </datalist>
            <button type="submit" className="button">
              Add
            </button>
          </div>
        </form>

        {selectedIngredients.length > 0 && (
          <div className="selected-ingredients">
            <h2 className="section-title">Selected Ingredients:</h2>
            <div className="ingredient-tags">
              {selectedIngredients.map((ingredient, index) => (
                <span key={index} className="ingredient-tag">
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(ingredient)}
                    className="remove-ingredient"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <button onClick={handleSearch} className="button search-button">
              Search Recipes
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.slice(0, 6).map((recipe) => (
            <RecipeCard 
              key={recipe.id}
              recipe={recipe}
              recipeId={recipe.id}
              onSave={() => handleSaveRecipe(recipe)}
              onDelete={() => { }} 
              isSaved={false}
              showSaveDelete={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;