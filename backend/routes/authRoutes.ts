import { Router } from 'express';
import { googleLogin, logout, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// This route will automatically be prefixed with /api/auth in index.ts
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe); // Protected: check current session

// router.post('/login', standardLogin);
// router.post('/signup', standardSignup);

export default router;