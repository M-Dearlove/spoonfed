// src/pages/IngredientsPage.tsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../interfaces/recipe';
import { IngredientCard } from '../components/IngredientCard';
import "../styles/Ingredientpage.css";
import { jwtDecode } from 'jwt-decode';
import Auth from '../utils/auth';

const SPOONACULAR_API_KEY = 'e2537b3be41447b78c479963501a884b';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Keeping your comprehensive ingredient list
const allIngredients = [
  // Proteins
  'Chicken Breasts', 'Beef Tenderloin', 'Pork Shoulder', 'Turkey Breast', 'Leg of Lamb',
  'Salmon', 'Tuna', 'Shrimp', 'Tofu', 'Egg',
];

const ingredientCategories = {

  Vegetables: ['Tomato', 'White Onion', 'Garlic', 'Green Bell Pepper', 'Spinach', 'Broccoli', 'Carrots', 'Zucchini'],
  Fruits: ['Apple', 'Bananas', 'Orange', 'Strawberries', 'Blueberries', 'Raspberries', 'Pineapple'],
  Grains: ['Long-Grain Rice', 'Quinoa', 'Pearl Barley', 'Steel Cut Oats', 'Sourdough Bread', 'Pasta', 'Couscous'],
  Dairy: ['Milk', 'Provolone Cheese', 'Plain Yogurt', 'Butter', 'Sour Cream', 'Egg'],
  Spices: ['Salt', 'Pepper', 'Garlic Powder', 'Onion Powder', 'Paprika', 'Cumin', 'Chili Powder'],
  Baking: ['Flour', 'Powdered Sugar', 'Baking Soda', 'Baking Powder', 'Vanilla Extract', 'Chocolate Chips'],
  Canned: ['Tomato Sauce', 'Black Beans', 'Fresh Corn', 'Canned Tuna', 'Chicken Broth', 'Coconut Milk'],
  Oils: ['Olive Oil', 'Vegetable Oil', 'Coconut Oil', 'Sesame Oil'],
  Sauces: ['Soy Sauce', 'Teriyaki Sauce', 'BBQ Sauce', 'Ketchup', 'Mayonnaise', 'Mustard'],
  Nuts: ['Almonds', 'Peanuts', 'Cashews', 'Walnuts', 'Pecans', 'Pistachios'],
  Legumes: ['Chickpeas', 'Lentils', 'Black Beans', 'Kidney Beans', 'Pinto Beans'],
  Seafood: ['Salmon', 'Tuna', 'Shrimp', 'Lump Crab', 'Lobster', 'Mussels'],
  Sweets: ['Chocolate', 'Chocolate Chip Cookies', 'Cake', 'Pie', 'Ice Cream'],
  Drinks: ['Coffee', 'Tea', 'Soda', 'Juice', 'Milk', 'Water'],
  Alcohol: ['Beer', 'Wine', 'Vodka', 'Whiskey', 'Rum', 'Tequila'],
  Miscellaneous: ['Honey', 'Maple Syrup', 'Vinegar', 'Soy Milk', 'Coconut Water', 'Nutritional Yeast'],

};

interface DecodedToken {
  username: string;
  userId: number;
  exp: number;
}

export const IngredientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = Auth.getToken(); // Use the Auth service instead of direct localStorage access
    console.log('Token from Auth service:', token);

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);
        setUserId(decoded.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

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

  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    const token = Auth.getToken();
    console.log('Current token:', token);

    if (!Auth.loggedIn()) {
      alert('Please log in to save recipes');
      return;
    }

    try {
      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          spoonacularId: recipe.id,
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          sourceUrl: recipe.sourceUrl,
          matchingIngredients: recipe.matchingIngredients,
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    }
  };

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

        <div className="firstCategory">
          <p>Proteins</p>
          <div className="ingredients-grid">
            {filteredIngredients.map((ingredient, index) => (
              <IngredientCard
                key={index}
                ingredient={ingredient}
                isSelected={selectedIngredients.has(ingredient)}
                onNavigate={() => handleIngredientInteraction(ingredient, 'navigate')}
                onSelect={() => handleIngredientInteraction(ingredient, 'select')}
              />
            ))}
          </div>
        </div>

        {recipes.length > 0 && (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
                <h3>{recipe.title}</h3>
                <div className="recipe-ingredients">
                  <p>Ingredients:</p>
                  {recipe.ingredients.slice(0, 6).map((ingredient, index) => (
                    <p key={index}>{ingredient}</p>
                  ))}
                  <p>Instruction:</p>
                  <p>
                    {stripHtmlTags(recipe.instructions.join(' ')).slice(0, 250)}
                    {stripHtmlTags(recipe.instructions.join(' ')).length > 250 && '...'}
                  </p>
                </div>
                <div className="recipe-actions">
                  {recipe.sourceUrl && (
                    <><a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-recipe-btn"
                    >
                      View Full Recipe & Directions
                    </a><button
                      onClick={() => handleSaveRecipe(recipe)}
                      className="save-recipe-btn"
                    >
                        Save Recipe
                      </button></>
                  )}
                </div>
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
                <IngredientCard
                  key={index}
                  ingredient={ingredient}
                  isSelected={selectedIngredients.has(ingredient)}
                  onNavigate={() => handleIngredientInteraction(ingredient, 'navigate')}
                  onSelect={() => handleIngredientInteraction(ingredient, 'select')}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsPage;
