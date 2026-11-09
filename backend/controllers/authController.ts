import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '../db';
import bcrypt from 'bcrypt';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Shared helper ──────────────────────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function signToken(userId: number, role: string) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
}

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google Token");

    const { sub: google_id, email, picture } = payload;

    let userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userQuery.rows[0];

    if (!user) {
      const baseName = email?.split('@')[0] || 'user';
      const username = `${baseName}_${google_id?.substring(0, 5)}`; 

      const insertQuery = `
        INSERT INTO users (username, email, google_id, profile_picture) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, username, email, role, profile_picture, rating
      `;
      const insertResult = await pool.query(insertQuery, [username, email, google_id, picture]);
      user = insertResult.rows[0];
    } else if (!user.google_id) {
      const updateQuery = `
        UPDATE users SET google_id = $1, profile_picture = $2 
        WHERE email = $3 RETURNING id, username, email, role, profile_picture, rating
      `;
      const updateResult = await pool.query(updateQuery, [google_id, picture, email]);
      user = updateResult.rows[0];
    }

    const appToken = signToken(user.id, user.role);

    res.cookie('clashCode_token', appToken, COOKIE_OPTIONS);
    res.json({ user });
    
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('clashCode_token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by authenticateToken middleware
    const { userId } = req.user as { userId: number; role: string };
    const result = await pool.query(
      'SELECT id, username, email, role, profile_picture, rating FROM users WHERE id = $1',
      [userId]
    );
    if (!result.rows[0]) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// ── Standard email/password login ─────────────────────────────────────────────
export const standardLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, role, password_hash, profile_picture, rating FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = signToken(user.id, user.role);
    res.cookie('clashCode_token', token, COOKIE_OPTIONS);

    // Don't send password_hash back to the client
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    console.error('Standard login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
};

// ── Standard email/password signup ────────────────────────────────────────────
export const standardSignup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: 'Username, email, and password are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }

  try {
    // Check if email already taken
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows[0]) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, profile_picture, rating`,
      [username, email, password_hash]
    );
    const user = insertResult.rows[0];

    const token = signToken(user.id, user.role);
    res.cookie('clashCode_token', token, COOKIE_OPTIONS);
    res.status(201).json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed.' });
  }
};