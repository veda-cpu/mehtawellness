import mongoose from 'mongoose';

const careEntrySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  category: { type: String, enum: ['consultation', 'medical-report', 'nutrition', 'yoga', 'meditation', 'follow-up', 'general'], required: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  note: { type: String, required: true, maxlength: 10000 },
  visibility: { type: String, enum: ['care-team', 'doctor-only'], default: 'care-team' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('CareEntry', careEntrySchema);
