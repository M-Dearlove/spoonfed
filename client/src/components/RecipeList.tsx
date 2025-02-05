import React from 'react'
import { Recipe } from '../interfaces/recipe';

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  if (!recipes.length) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No recipes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Found Recipes:</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="relative h-48">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-recipe.jpg';
                }}
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold">{recipe.title}</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Used Ingredients:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.usedIngredients.map((ingredient, index) => (
                    <span 
                      key={`used-${recipe.id}-${index}`}
                      className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {recipe.missedIngredients.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Missing Ingredients:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.missedIngredients.map((ingredient, index) => (
                      <span 
                        key={`missed-${recipe.id}-${index}`}
                        className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;