import express from 'express';
import * as aiController from '../../controllers/aiController.js';

const router = express.Router();

// Route for streaming recipes
router.get("/recipeStream", aiController.getRecipeStream);

export { router as aiRouter };