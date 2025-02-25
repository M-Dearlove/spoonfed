import { Request, Response } from 'express';
import { User } from '../models/user.js';
import { SavedRecipe } from '../models/Recipe.js';

// GET /Users/:id
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // POST /Users
  export const createUser = async (req: Request, res: Response) => {
    console.log('Received registration request:', req.body);
    const { username, password } = req.body;
    try {
      const newUser = await User.create({ username, password });
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error('Error creating user:', error);
      res.status(400).json({ message: error.message });
    }
  };
  // POST /Users/save-recipe
  export const saveRecipe = async (req: Request, res: Response) => {
    try {
      const { userId, recipe } = req.body;
  
      // Find the user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create new saved recipe
      const savedRecipe = await SavedRecipe.create({
        userId: userId,
        spoonacularId: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        sourceUrl: recipe.sourceUrl,
        matchingIngredients: recipe.matchingIngredients
      });
  
      return res.status(200).json({ 
        message: 'Recipe saved successfully',
        recipe: savedRecipe
      });
  
    } catch (error) {
      console.error('Error saving recipe:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };