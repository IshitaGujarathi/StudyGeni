import File from '../models/file.model.js';
import cloudinary from '../config/cloud.js';

// @desc    Upload a new file (Teacher only)
// @route   POST /api/files
export const uploadFile = async (req, res) => {
    try {
        const { title, description, subject } = req.body;
        if (!title || !subject) {
            return res.status(400).json({ message: "Title and subject are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File upload is required" });
        }

        const newFile = await File.create({
            title,
            description,
            subject,
            fileUrl: req.file.path,
            cloudinaryPublicId: req.file.filename,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            file: newFile
        });

    } catch (error) {
        console.error("Error in uploadFile controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Get all files (for Students and Teachers)
// @route   GET /api/files
export const getAllFiles = async (req, res) => {
    try {
        const files = await File.find().populate('createdBy', 'name').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: files.length,
            files
        });
    } catch (error) {
        console.error("Error in getAllFiles controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Get a specific file by ID
// @route   GET /api/files/:id
export const getSpecificFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id).populate('createdBy', 'name');
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        res.status(200).json({ success: true, file });
    } catch (error) {
        console.error("Error in getSpecificFile controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Delete a file (Teacher who uploaded it only)
// @route   DELETE /api/files/:id
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Check if the user deleting the file is the one who created it
        if (file.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied. You can only delete your own files." });
        }

        // 1. Delete from Cloudinary
        await cloudinary.uploader.destroy(file.cloudinaryPublicId);

        // 2. Delete from Database
        await File.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error("Error in deleteFile controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
