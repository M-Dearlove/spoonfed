import express from "express";
import RecipeController from "../../controllers/recipe-controller.js";
import { authenticateToken } from '../../middleware/auth.js';
import { SavedRecipe } from '../../models/Recipe.js';

const router = express.Router();

// get recipes
router.get("/findByIngredients", RecipeController.findByIngredients);

router.get("/:recipeId/information", RecipeController.getRecipeInformation);

// Add save recipe endpoint
router.post('/save', authenticateToken, async (req, res) => {
    console.log('Save request body:', req.body); // Debug log
    
    if (!req.body.userId) {
        return res.status(400).json({ 
            error: 'Missing userId',
            body: req.body 
        });
    }

    try {
        const recipe = await SavedRecipe.create({
            ...req.body,
            userId: req.body.userId
        });
        return res.status(201).json(recipe);
    } catch (error) {
        console.error('Error saving recipe:', error);
        return res.status(500).json({ 
            error: 'Failed to save recipe',
            details: (error as Error).message 
        });
    }
});

// Get saved recipes
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

export { router as recipeRouter };