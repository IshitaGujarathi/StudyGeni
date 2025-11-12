import express from 'express';
// Import the new controller functions
import { generateSummary, generateQuiz } from '../controllers/ai.controller.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get AI-generated summary
// @route   GET /api/ai/summary/:fileId
router.get('/summary/:fileId', protectRoute, generateSummary);

// @desc    Get AI-generated quiz
// @route   GET /api/ai/quiz/:fileId
router.get('/quiz/:fileId', protectRoute, generateQuiz);

export default router;