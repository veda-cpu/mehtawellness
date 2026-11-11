import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
