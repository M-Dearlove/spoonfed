// PairingSuggestions.tsx
import React, { useState, useEffect } from 'react';

import { Dessert, Drink } from '../interfaces/Baseitem';





interface PairingSuggestionsProps {
  recipeId: string;
}

const PairingSuggestions: React.FC<PairingSuggestionsProps> = ({ recipeId }) => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPairings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch drink pairings
        const drinksResponse = await fetch(`/api/pairings/drinks/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Fetch dessert pairings
        const dessertsResponse = await fetch(`/api/pairings/desserts/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const drinksData = await drinksResponse.json();
        const dessertsData = await dessertsResponse.json();

        if (!drinksResponse.ok) throw new Error(drinksData.error);
        if (!dessertsResponse.ok) throw new Error(dessertsData.error);

        setDrinks(drinksData.drinks);
        setDesserts(dessertsData.desserts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pairings');
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchPairings();
    }
  }, [recipeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drink Pairings */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recommended Drinks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drinks.map((drink) => (
            <div 
              key={drink.id} 
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {drink.imageUrl && (
                <img 
                  src={drink.imageUrl} 
                  alt={drink.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <h4 className="font-medium">{drink.name}</h4>
              <p className="text-sm text-gray-600">{drink.type}</p>
              <p className="text-sm mt-1">{drink.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dessert Pairings */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recommended Desserts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desserts.map((dessert) => (
            <div 
              key={dessert.id} 
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {dessert.imageUrl && (
                <img 
                  src={dessert.imageUrl} 
                  alt={dessert.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <h4 className="font-medium">{dessert.name}</h4>
              <p className="text-sm text-gray-600">{dessert.type}</p>
              <p className="text-sm mt-1">{dessert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PairingSuggestions;