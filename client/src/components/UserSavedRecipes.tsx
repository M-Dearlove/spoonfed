import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Auth from '../utils/auth';
import '../styles/UserSavedRecipes.css';

interface SavedRecipe {
  id: number;
  spoonacularId: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
  matchingIngredients: string;
}

const UserSavedRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const token = Auth.getToken();
        if (!token) {
          throw new Error('Please log in to view your saved recipes');
        }

        const response = await fetch('/api/recipes/saved', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved recipes');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load saved recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!confirm('Are you sure you want to remove this recipe?')) {
      return;
    }

    try {
      const token = Auth.getToken();
      const response = await fetch(`/api/recipes/saved/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="saved-recipes-page">
        <div className="loading-container">
          <p>Loading your saved recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-recipes-page">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="saved-recipes-page">
        <div className="empty-state">
          <p className="empty-title">You haven't saved any recipes yet!</p>
          <p className="empty-subtitle">
            Browse recipes and click "Save Recipe" to add them to your collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-recipes-page">
      <div className="saved-recipes-container">
        <h1 className="page-title">My Saved Recipes</h1>
        
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image-container">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="recipe-image"
                />
              </div>
              
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>

                <div className="recipe-actions">
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-recipe-btn"
                  >
                    View Full Recipe
                  </a>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="delete-recipe-btn"
                    title="Remove recipe"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSavedRecipes;