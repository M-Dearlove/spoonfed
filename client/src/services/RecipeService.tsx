
export const searchRecipes = async (ingredients: string[]) => {
    const response = await fetch('/api/recipes/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ingredients })
    });
  
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
  
    return data.recipes;
  };
  
  export const getRecipe = async (id: string) => {
    const response = await fetch(`/api/recipes/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
  
    return data.recipe;
  };
  export default searchRecipes;