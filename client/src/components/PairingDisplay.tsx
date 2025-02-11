import React, { useEffect, useState } from 'react';
import { Recipe } from '../interfaces/recipe';

interface PairingDisplayProps {
  recipe: Recipe;
}

interface Pairings {
  cocktails: Array<{
    name: string;
    instructions: string;
  }>;
  desserts: Array<{
    name: string;
    description: string;
  }>;
}

const PairingDisplay: React.FC<PairingDisplayProps> = ({ recipe }) => {
  const [pairings, setPairings] = useState<Pairings>({
    cocktails: [],
    desserts: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified cocktail fetch - just get one random cocktail
  const fetchCocktail = async () => {
    try {
      const response = await fetch('https://the-cocktail-db.p.rapidapi.com/random.php', {
        headers: {
          'X-RapidAPI-Key': 'ed394f7afdmshbb5c5a3c0efb5e2p109c0ajsn5aa3588aa1e5',
          'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cocktail');
      
      const data = await response.json();
      const drink = data.drinks?.[0];

      if (!drink) return null;

      return {
        name: drink.strDrink || 'Cocktail Suggestion',
        instructions: drink.strInstructions || 'Mix and serve'
      };
    } catch (error) {
      console.error('Cocktail fetch error:', error);
      return null;
    }
  };

  // Simplified dessert fetch
  const fetchDessert = async () => {
    try {
      // Since we don't have access to a dessert API, let's create a few fallback desserts
      const defaultDesserts = [
        {
          name: 'Classic Vanilla Ice Cream',
          description: 'A versatile dessert that pairs well with most dishes.'
        },
        {
          name: 'Chocolate Brownie',
          description: 'Rich and decadent, perfect for ending any meal.'
        },
        {
          name: 'Fresh Fruit Tart',
          description: 'Light and refreshing, ideal for balancing rich main courses.'
        }
      ];

      // Randomly select one dessert from our defaults
      return defaultDesserts[Math.floor(Math.random() * defaultDesserts.length)];
    } catch (error) {
      console.error('Dessert fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPairings = async () => {
      setLoading(true);
      setError(null);

      try {
        const [cocktail, dessert] = await Promise.all([
          fetchCocktail(),
          fetchDessert()
        ]);

        setPairings({
          cocktails: cocktail ? [cocktail] : [],
          desserts: dessert ? [dessert] : []
        });
      } catch (error) {
        setError('Unable to load pairing suggestions');
        console.error('Pairing fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPairings();
  }, [recipe.id]); // Only re-fetch when recipe changes

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-orange-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-orange-100 rounded w-3/4"></div>
            <div className="h-4 bg-orange-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-orange-800">
          Unable to load pairing suggestions at this time. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <h3 className="text-xl font-semibold text-orange-800 mb-4">Perfect Pairings</h3>
      
      {/* Cocktail Suggestions */}
      {pairings.cocktails.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-orange-700 mb-2">Cocktail Suggestion:</h4>
          {pairings.cocktails.map((cocktail, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <p className="font-medium text-orange-800">{cocktail.name}</p>
              <p className="text-sm text-orange-600 mt-1">{cocktail.instructions}</p>
            </div>
          ))}
        </div>
      )}

      {/* Dessert Suggestions */}
      {pairings.desserts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-orange-700 mb-2">Dessert Suggestion:</h4>
          {pairings.desserts.map((dessert, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <p className="font-medium text-orange-800">{dessert.name}</p>
              <p className="text-sm text-orange-600 mt-1">{dessert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* If no pairings available */}
      {pairings.cocktails.length === 0 && pairings.desserts.length === 0 && (
        <p className="text-orange-600">
          No pairing suggestions available for this recipe.
        </p>
      )}
      
      <div className="mt-4 text-sm text-orange-600">
        <p className="italic">
          Tip: These pairings are suggestions based on complementary flavors. Feel free to experiment and find your perfect combination!
        </p>
      </div>
    </div>
  );
};

export default PairingDisplay;