import { Router } from 'express';
import { userRouter } from './user-routes.js';
import { recipeRouter } from './recipe-routes.js';
import { cocktailRouter } from './cocktail-routes.js';
import { userProfileRouter } from './user-profile-routes.js';

const apiRouter = Router();

apiRouter.use((req, res, next) => {
    console.log('API router hit:', req.path);
    next();
  });

  apiRouter.get('/test', (req, res) => {
    res.json({ message: 'API router working' });
  });

apiRouter.use('/users', userRouter);
apiRouter.use('/recipes', recipeRouter);
apiRouter.use('/cocktails', cocktailRouter);
apiRouter.use('/profile', userProfileRouter);

export default apiRouter;
