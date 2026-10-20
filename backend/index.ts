import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db'; // Import your new database connection

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Basic API test route
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ message: "Backend is running and connected!", status: "OK" });
});

// Database test route (Time Query)
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});