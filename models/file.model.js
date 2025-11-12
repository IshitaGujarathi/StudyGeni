import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    cloudinaryPublicId: {
        type: String,
        required: [true, 'Cloudinary Public ID is required']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;