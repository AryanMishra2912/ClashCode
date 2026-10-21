import { Router } from 'express';
import { googleLogin } from '../controllers/authController';

const router = Router();

// This route will automatically be prefixed with /api/auth in index.ts
router.post('/google', googleLogin);

// router.post('/login', standardLogin);
// router.post('/signup', standardSignup);

export default router;