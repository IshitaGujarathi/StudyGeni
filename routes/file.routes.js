import express from 'express';
import {
    uploadFile,
    getAllFiles,
    getSpecificFile,
    deleteFile,
  
} from '../controllers/file.controller.js';
import { protectRoute, isTeacher } from '../middleware/auth.js';
import upload from '../middleware/multer.js'; // Import the multer upload config

const router = express.Router();

// --- Teacher Routes ---
router.post(
    '/',
    protectRoute,
    isTeacher,
    upload.single('file'), // 'file' is the field name in the form-data
    uploadFile
);

router.delete(
    '/:id',
    protectRoute,
    isTeacher,
    deleteFile
);

// --- Student & Teacher Routes ---
// All authenticated users can get files
router.get('/', protectRoute, getAllFiles);
router.get('/:id', protectRoute, getSpecificFile);


export default router;