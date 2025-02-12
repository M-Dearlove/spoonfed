import axios from 'axios';
import { Recipe, Pairing } from '../interfaces/recipe';
import { Drink, Dessert } from '../interfaces/Baseitem';

const SPOONACULAR_API_KEY = '3cc81872f31f454d9420393beffe1d15';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_BASE_URL = 'http://localhost:3001/api';
const COCKTAIL_API_URL = 'https://the-cocktail-db.p.rapidapi.com';
const DESSERT_API_URL = 'your_dessert_api_endpoint';

// Your RapidAPI key
const RAPIDAPI_KEY = 'your_rapidapi_key';
interface SpoonacularIngredient {
  original: string;
  name: string;
}

interface SpoonacularResponse {
  id: number;
  title: string;
  summary?: string;
  cookTime?: number;
  readyInMinutes?: number;
  servings?: number;
  extendedIngredients?: SpoonacularIngredient[];
  instructions?: string;
  image?: string;
  sourceUrl?: string;
  usedIngredients?: SpoonacularIngredient[];
  missedIngredients?: SpoonacularIngredient[];
}

interface CocktailDBResponse {
  drinks: {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
  }[];
}

export const getRecipeDetails = async (recipeId: string): Promise<Recipe> => {
  try {
    const response = await axios.get<SpoonacularResponse>(
      `${SPOONACULAR_BASE_URL}/${recipeId}/information`,
      {
        params: {
          apiKey: SPOONACULAR_API_KEY
        }
      }
    );

    const data = response.data;
    console.log('Recipe Details Response:', data);

    const recipe: Recipe = {
      id: data.id.toString(),
      title: data.title,
      description: data.summary,
      summary: data.summary,
      cookTime: data.cookTime,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      ingredients: data.extendedIngredients?.map(ing => ing.original) || [],
      instructions: data.instructions?.split('\n').filter(Boolean) || [],
      imageUrl: data.image,
      image: data.image,
      spoonacularId: data.id,
      usedIngredients: data.usedIngredients?.map(ing => ing.original) || [],
      missedIngredients: data.missedIngredients?.map(ing => ing.original) || [],
      usedIngredientCount: data.usedIngredients?.length || 0,
      missedIngredientCount: data.missedIngredients?.length || 0,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      suggestedPairings: [],
      customPairings: [],
      pairings: [],
      searchMode: false,
      sourceUrl: data.sourceUrl,
      matchingIngredients: data
    };

    // Fetch pairings asynchronously
    try {
      const [drinks, desserts] = await Promise.all([
        searchCocktailPairings(recipeId),
        searchDessertPairings(recipeId)
      ]);

      const drinkPairings: Pairing[] = drinks.map(drink => ({
        id: drink.id,
        type: 'drink',
        name: drink.name,
        description: drink.description,
        imageUrl: drink.imageUrl || ''
      }));

      const dessertPairings: Pairing[] = desserts.map(dessert => ({
        id: dessert.id,
        type: 'dessert',
        name: dessert.name,
        description: dessert.description,
        imageUrl: dessert.image
      }));

      recipe.pairings = [...drinkPairings, ...dessertPairings];
      recipe.suggestedPairings = recipe.pairings;
    } catch (pairingError) {
      console.error('Error fetching pairings:', pairingError);
      // Don't fail the whole recipe fetch if pairings fail
    }

    return recipe;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const searchCocktailPairings = async (_recipeId: string): Promise<Drink[]> => {
  try {
    const response = await axios.get<CocktailDBResponse>(`${COCKTAIL_API_URL}/filter.php`, {
      params: { c: 'Cocktail' },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
      }
    });

    return (response.data.drinks || []).slice(0, 3).map(drink => ({
      id: drink.idDrink,
      name: drink.strDrink,
      description: 'A perfectly paired cocktail for your meal',
      type: 'drink',
      imageUrl: drink.strDrinkThumb
    }));
  } catch (error) {
    console.error('Error fetching cocktail pairings:', error);
    return [];
  }
};

export const searchDessertPairings = async (_recipeId: string): Promise<Dessert[]> => {
  try {
    interface DessertResponse {
      id: string;
      name: string;
      description?: string;
      image: string;
    }

    const response = await axios.get<DessertResponse[]>(DESSERT_API_URL, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': new URL(DESSERT_API_URL).hostname
      }
    });

    return response.data.slice(0, 3).map(dessert => ({
      id: dessert.id,
      name: dessert.name,
      description: dessert.description || 'A delightful dessert pairing',
      type: 'dessert',
      imageUrl: dessert.image,
      image: dessert.image
    }));
  } catch (error) {
    console.error('Error fetching dessert pairings:', error);
    return [];
  }
};

export const searchRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const response = await axios.get<SpoonacularResponse[]>(
      `${SPOONACULAR_BASE_URL}/findByIngredients`,
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ingredients: ingredients.join(','),
          number: 10
        }
      }
    );

    return response.data.map((item): Recipe => ({
      id: item.id.toString(),
      title: item.title,
      ingredients: item.extendedIngredients?.map(ing => ing.original) || [],
      instructions: [],
      image: item.image,
      imageUrl: item.image,
      missedIngredientCount: item.missedIngredients?.length || 0,
      missedIngredients: item.missedIngredients?.map(ing => ing.name) || [],
      usedIngredientCount: item.usedIngredients?.length || 0,
      usedIngredients: item.usedIngredients?.map(ing => ing.name) || [],
      suggestedPairings: [],
      customPairings: [],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      searchMode: true,
      sourceUrl: undefined,
      matchingIngredients: '',
      pairings: [],
      description: undefined,
      summary: undefined,
      cookTime: undefined,
      readyInMinutes: undefined,
      servings: undefined,
      spoonacularId: item.id
    }));
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Save recipe with pairings
export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      throw new Error('Authentication required');
    }

    // Fetch pairings before saving
    const [drinks, desserts] = await Promise.all([
      searchCocktailPairings(recipe.id),
      searchDessertPairings(recipe.id)
    ]);

    const recipeWithPairings = {
      ...recipe,
      pairings: [...drinks, ...desserts],
      savedAt: new Date().toISOString()
    };

    // Save to backend
    await axios.post(
      `${API_BASE_URL}/users/${userId}/saved-recipes`,
      { recipe: recipeWithPairings },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Save to localStorage
    const savedRecipes = JSON.parse(localStorage.getItem(`userProfile_${userId}_recipes`) || '[]');
    if (!savedRecipes.some((saved: Recipe) => saved.id === recipe.id)) {
      savedRecipes.push(recipeWithPairings);
      localStorage.setItem(`userProfile_${userId}_recipes`, JSON.stringify(savedRecipes));
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

// Get saved recipes
export const getSavedRecipes = async (userId: string): Promise<Recipe[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}/saved-recipes`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.savedRecipes || [];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    return JSON.parse(localStorage.getItem(`userProfile_${userId}_recipes`) || '[]');
  }
};

// Remove recipe
export const removeSavedRecipe = async (recipeId: string, userId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    await axios.delete(
      `${API_BASE_URL}/users/${userId}/saved-recipes/${recipeId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const savedRecipes = JSON.parse(localStorage.getItem(`userProfile_${userId}_recipes`) || '[]');
    const updatedRecipes = savedRecipes.filter((recipe: Recipe) => recipe.id !== recipeId);
    localStorage.setItem(`userProfile_${userId}_recipes`, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error removing recipe:', error);
    throw error;
  }
};
