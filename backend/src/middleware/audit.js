import AuditLog from '../models/AuditLog.js';

export async function writeAudit(req, action, resourceType, resourceId = '') {
  try {
    await AuditLog.create({
      actor: req.user?._id,
      action, resourceType, resourceId: String(resourceId || ''),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || ''
    });
  } catch (error) {
    // In production, send audit-write failures to monitoring and fail closed for high-risk actions.
    console.error('Audit log write failed:', error.message);
  }
}
