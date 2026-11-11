import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'doctor', 'nutritionist', 'yoga', 'meditation'], required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
