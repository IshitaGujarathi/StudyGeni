import express from 'express';
import { signup, login, getMe } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protectRoute, getMe); // As per your diagram: "Get User Info"

export default router;