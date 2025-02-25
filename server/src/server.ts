import dotenv from "dotenv";
dotenv.config();

import express from "express";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware order is important
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// Mount all routes
app.use('/', routes);

// Test route at server level
app.get('/server-test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('Available test routes:');
    console.log('- /server-test');
    console.log('- /test');
    console.log('- /api/test');
    console.log('- /api/profile/test');
  });
});