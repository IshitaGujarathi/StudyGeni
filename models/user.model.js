import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { // Changed from 'username' to 'name' as per your diagram
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [30, 'Name must be at most 30 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [4, 'Password must be at least 6 characters long'],
        select: false // Automatically hide password from query results
    },
    role: {
        type: String,
        enum: ['student', 'teacher'], // Roles as per your diagram
        default: 'student'
    }
}, { timestamps: true }); // Added timestamps

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;