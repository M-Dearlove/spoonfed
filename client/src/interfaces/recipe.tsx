export interface Recipe {
    id: string;
    title: string;
    description: string;
    cookTime: number;
    servings: number;
    ingredients: string[];
    instructions: string[];
    imageUrl?: string;
    image: string;
    spoonacularId?: number;
    usedIngredients: string[];
    missedIngredients: string[];
    suggestedPairings?: Pairing[];
    customPairings?: Pairing[];
    pairing: Pairing[];
    
  }

  export interface Pairing {
    id: string;
    type: 'drink' | 'dessert';  
    name: string;
    description?: string;
    imageUrl?: string;
  }