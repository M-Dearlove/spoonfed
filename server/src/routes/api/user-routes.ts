import express from 'express';
import { getUserById, createUser, saveRecipe } from '../../controllers/user-controller.js';
import { authenticateToken } from '../../middleware/auth';
import { login } from '../../controllers/auth-controllers'
const app = express.Router();

// Login route
app.post('/api/login', login);

// GET request - gets user by id
app.get('/:id', getUserById);

// POST request - creates a new user
app.post('/', createUser);

app.post('/save-recipe',authenticateToken, saveRecipe)

export { app as userRouter };