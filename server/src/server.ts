import dotenv from "dotenv";
dotenv.config();

import express from "express";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import cors from "cors";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// Middleware order is important
app.use(express.json());

app.use(cors({
  origin: [process.env.DB_URL || "http://localhost:3000", "https://spoonfed-prod.onrender.com"],
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
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    // Start server anyway, so at least the web part works
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is listening on port ${PORT} (without database)`);
    });
  });