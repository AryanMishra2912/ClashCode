import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '../db'; 

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      const updateResult = await pool.query(updateQuery, [updateQuery, picture, email]);
      user = updateResult.rows[0];
    }

    const appToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({ token: appToken, user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

// You can add export const login = async (...) and export const signup = async (...) here later