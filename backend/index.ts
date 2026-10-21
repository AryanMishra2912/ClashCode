import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db'; 
import authRoutes from './routes/authRoutes'; // Import your modular auth routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================
app.use('/api/auth', authRoutes);

// ==========================================
// HEALTH CHECKS
// ==========================================
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ message: "Backend is running and connected!", status: "OK" });
});

app.get('/api/db-status', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: "Database connection successful!", 
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed", details: err });
  }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});