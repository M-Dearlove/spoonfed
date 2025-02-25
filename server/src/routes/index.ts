import { Router } from "express";
import authRoutes from "./auth-routes.js";
import apiRouter from "./api/index.js";

const router = Router();

router.use((req, res, next) => {
    console.log('Main router hit:', req.path);
    next();
  });

router.use("/auth", authRoutes);
router.use("/api", apiRouter);

router.get('/test', (req, res) => {
    res.json({ message: 'Root router working' });
  });

export default router;
