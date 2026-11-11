import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 32 },
  fullName: { type: String, required: true, trim: true, maxlength: 160 },
  email: { type: String, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30 },
  dateOfBirth: { type: Date },
  status: { type: String, enum: ['active', 'follow-up', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

patientSchema.index({ fullName: 'text', patientId: 'text' });
export default mongoose.model('Patient', patientSchema);
