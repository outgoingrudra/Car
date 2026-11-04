import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['owner', 'user'],
        default: 'user'
    },
    image: {
        type: String,
        default: '',
    },
    // Older accounts without this field remain able to log in.
    isEmailVerified: { type: Boolean, default: true },
    verificationCodeHash: { type: String, select: false },
    verificationCodeExpiresAt: { type: Date, select: false },
    verificationCodeSentAt: { type: Date, select: false },
    verificationCodeAttempts: { type: Number, select: false, default: 0 },
    tokenVersion: { type: Number, default: 0 },
    resetCodeHash: { type: String, select: false },
    resetCodeExpiresAt: { type: Date, select: false },
    resetCodeSentAt: { type: Date, select: false },
    resetCodeAttempts: { type: Number, select: false },
    pendingEmail: { type: String, select: false },
    emailChangeCodeHash: { type: String, select: false },
    emailChangeExpiresAt: { type: Date, select: false },
    emailChangeSentAt: { type: Date, select: false },
    emailChangeAttempts: { type: Number, select: false, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
