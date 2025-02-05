import React, { useState } from 'react';
import { Recipe } from '../interfaces/recipe';
interface RecipeCardProps {
  recipeId: string;
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [showPairings, setShowPairings] = useState(false);

  // Loading state
  if (!recipe) {
    return <div className="rounded-lg border p-4">Loading recipe...</div>;
  }

  // Helper to check if recipe has any pairings
  const hasPairings = recipe.suggestedPairings?.length || recipe.customPairings?.length;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="relative h-48">
        <img
          className="w-full h-full object-cover"
          src={recipe.imageUrl || recipe.image} // Use imageUrl first, fallback to image
          alt={recipe.title}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-recipe.jpg';
          }}
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
      </div>
      
      <div className="px-4 pb-4">
        <p className="text-gray-700 text-base mb-4">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.map((ingredient, index) => (
            <span 
              key={`${ingredient}-${index}`}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
            >
              {ingredient}
            </span>
          ))}
        </div>
        
        {typeof recipe.cookTime === 'number' && (
          <div className="mt-4 text-sm text-gray-600">
            Cook time: {recipe.cookTime} minutes
          </div>
        )}
        
        {typeof recipe.servings === 'number' && (
          <div className="text-sm text-gray-600">
            Servings: {recipe.servings}
          </div>
        )}

        {/* Updated Pairings section */}
        {hasPairings && (
          <div className="mt-4">
            <button 
              onClick={() => setShowPairings(!showPairings)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showPairings ? 'Hide' : 'Show'} Pairings
            </button>
            
            {showPairings && (
              <div className="mt-4 space-y-4">
                {recipe.suggestedPairings && recipe.suggestedPairings.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Suggested Pairings</h3>
                    <div className="space-y-2">
                      {recipe.suggestedPairings.map((pairing) => (
                        <div key={pairing.id} className="text-sm">
                          <span className="font-medium capitalize">{pairing.type}</span>: {pairing.name}
                          {pairing.description && (
                            <p className="text-gray-600 text-xs mt-1">{pairing.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recipe.customPairings && recipe.customPairings.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Custom Pairings</h3>
                    <div className="space-y-2">
                      {recipe.customPairings.map((pairing) => (
                        <div key={pairing.id} className="text-sm">
                          <span className="font-medium capitalize">{pairing.type}</span>: {pairing.name}
                          {pairing.description && (
                            <p className="text-gray-600 text-xs mt-1">{pairing.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;