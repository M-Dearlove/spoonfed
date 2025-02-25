// routes/recipes.ts
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { SavedRecipe } from '../models/Recipe.js';

const router = express.Router();

// Add authentication middleware to protect these routes
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const recipe = await SavedRecipe.create({
      ...req.body,
      userId: req.body.userId
    });
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// Update this route to get recipes for the authenticated user
router.get('/saved', authenticateToken, async (req, res) => {
  try {
    const recipes = await SavedRecipe.findAll({
      where: {
        userId: req.body.userId
      }
    });
    
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No saved recipes found' });
    }

    return res.json(recipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    return res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// Add a route to delete a saved recipe
router.delete('/saved/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await SavedRecipe.destroy({
      where: {
        id: id,
        userId: req.body.userId
      }
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;