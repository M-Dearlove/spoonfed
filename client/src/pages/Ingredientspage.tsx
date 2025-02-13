// src/pages/IngredientsPage.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../interfaces/recipe';
import "../styles/Ingredientpage.css";

const SPOONACULAR_API_KEY = 'e26291c2c7864721928dd4284508475d';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Keeping your comprehensive ingredient list
const allIngredients = [
  // Proteins
  'Chicken', 'Beef', 'Pork', 'Turkey', 'Lamb', 
  'Salmon', 'Tuna', 'Shrimp', 'Tofu', 'Eggs',
];

const ingredientCategories = {
 
  Vegetables: ['Tomatoes', 'Onions', 'Garlic', 'Bell Peppers', 'Spinach', 'Broccoli', 'Carrots', 'Zucchini'],
  Fruits: ['Apples', 'Bananas', 'Oranges', 'Strawberries', 'Blueberries', 'Raspberries', 'Pineapple'],
  Grains: ['Rice', 'Quinoa', 'Barley', 'Oats', 'Bread', 'Pasta', 'Couscous'],
  Dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Eggs'],
  Spices: ['Salt', 'Pepper', 'Garlic Powder', 'Onion Powder', 'Paprika', 'Cumin', 'Chili Powder'],
  Baking: ['Flour', 'Sugar', 'Baking Soda', 'Baking Powder', 'Vanilla Extract', 'Chocolate Chips'],
  Canned: ['Tomato Sauce', 'Beans', 'Corn', 'Tuna', 'Chicken Broth', 'Coconut Milk'],
  Oils: ['Olive Oil', 'Vegetable Oil', 'Coconut Oil', 'Sesame Oil', 'Canola Oil'],
  Sauces: ['Soy Sauce', 'Teriyaki Sauce', 'BBQ Sauce', 'Ketchup', 'Mayonnaise', 'Mustard'],
  Nuts: ['Almonds', 'Peanuts', 'Cashews', 'Walnuts', 'Pecans', 'Pistachios'],
  Legumes: ['Chickpeas', 'Lentils', 'Black Beans', 'Kidney Beans', 'Pinto Beans'],
  Seafood: ['Salmon', 'Tuna', 'Shrimp', 'Crab', 'Lobster', 'Mussels'],
  Sweets: ['Chocolate', 'Candy', 'Cookies', 'Cake', 'Pie', 'Ice Cream'],
  Drinks: ['Coffee', 'Tea', 'Soda', 'Juice', 'Milk', 'Water'],
  Alcohol: ['Beer', 'Wine', 'Vodka', 'Whiskey', 'Rum', 'Tequila'],
  Miscellaneous: ['Honey', 'Maple Syrup', 'Vinegar', 'Soy Milk', 'Coconut Water', 'Nutritional Yeast'],

};

export const IngredientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIngredientInteraction = (ingredient: string, mode: 'navigate' | 'select' = 'navigate') => {
    if (mode === 'navigate') {
      navigate(`/ingredient/${ingredient.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      setSelectedIngredients(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ingredient)) {
          newSet.delete(ingredient);
        } else {
          newSet.add(ingredient);
        }
        return newSet;
      });
    }
  };

  const searchRecipes = useCallback(async () => {
    if (selectedIngredients.size === 0) {
      setError('Please select at least one ingredient');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const ingredientsString = Array.from(selectedIngredients).join(',');
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${ingredientsString}&number=6`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      
      
      const detailedRecipes = await Promise.all(
        data.map(async (recipe: any) => {
          const detailResponse = await fetch(
            `${SPOONACULAR_BASE_URL}/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`
          );
          const detailData = await detailResponse.json();
          
          return {
            id: recipe.id.toString(),
            title: recipe.title,
            imageUrl: recipe.image,
            image: recipe.image,
            ingredients: detailData.extendedIngredients?.map((ing: any) => ing.original) || [],
            instructions: detailData.instructions?.split('\n').filter(Boolean) || [],
            usedIngredients: recipe.usedIngredients.map((ing: any) => ing.name),
            missedIngredients: recipe.missedIngredients.map((ing: any) => ing.name),
            usedIngredientCount: recipe.usedIngredientCount,
            missedIngredientCount: recipe.missedIngredientCount,
            pairings: [],
            isFavorite: false,
            searchMode: true,
            foodGroup: '',
            sourceUrl: detailData.sourceUrl,
            matchingIngredients: recipe.usedIngredients.map((ing: any) => ing.name).join(', '),
            name: recipe.title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        })
      );

      setRecipes(detailedRecipes);

      if (detailedRecipes.length === 0) {
        setError('No recipes found with selected ingredients');
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError(error instanceof Error ? error.message : 'Failed to search recipes');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIngredients]);

  const filteredIngredients = useMemo(() => {
    return allIngredients.filter(ingredient => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="ingredients-page">
      <div className="ingredients-container">
        <h1 className="page-title">Ingredients Library</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          
          <div className="search-actions">
            <span className="selected-count">
              Selected: {selectedIngredients.size}
            </span>
            <button
              onClick={searchRecipes}
              disabled={selectedIngredients.size === 0 || isLoading}
              className="generate-button"
            >
              {isLoading ? 'Searching...' : 'Find Recipes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="ingredients-grid">
          {filteredIngredients.map((ingredient, index) => (
            <div
              key={index}
              className={`ingredient-card ${selectedIngredients.has(ingredient) ? 'selected' : ''}`}
            >
              <div 
                className="ingredient-name"
                onClick={() => handleIngredientInteraction(ingredient, 'navigate')}
              >
                {ingredient}
              </div>
              <button 
                className="ingredient-select-btn"
                onClick={() => handleIngredientInteraction(ingredient, 'select')}
              >
                {selectedIngredients.has(ingredient) ? '✓' : '+'}
              </button>
            </div>
          ))}
        </div>

        {recipes.length > 0 && (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
                <h3>{recipe.title}</h3>
                <div className="recipe-ingredients">
                  <p>Used Ingredients: {recipe.usedIngredientCount}</p>
                  <p>Missing Ingredients: {recipe.missedIngredientCount}</p>
                </div>
                <button 
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="view-recipe-btn"
                >
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        )}

        {Object.entries(ingredientCategories).map(([category, ingredients]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <div className="ingredients-grid">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient-card ${selectedIngredients.has(ingredient) ? 'selected' : ''}`}
                >
                  <div 
                    className="ingredient-name"
                    onClick={() => handleIngredientInteraction(ingredient, 'navigate')}
                  >
                    {ingredient}
                  </div>
                  <button 
                    className="ingredient-select-btn"
                    onClick={() => handleIngredientInteraction(ingredient, 'select')}
                  >
                    {selectedIngredients.has(ingredient) ? '✓' : '+'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsPage;