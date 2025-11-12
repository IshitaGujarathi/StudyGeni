import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloud.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studygeni-uploads', // Folder name in Cloudinary
    resource_type: 'auto', // Automatically detect file type
    allowed_formats: ['pdf', 'pptx', 'docx'], // As per your diagram
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation here if needed
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 20 // 20MB file size limit
  }
});

export default upload;