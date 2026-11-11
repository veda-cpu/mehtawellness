import { Router } from 'express';
import { z } from 'zod';
import Patient from '../models/Patient.js';
import CareEntry from '../models/CareEntry.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { writeAudit } from '../middleware/audit.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(requireAuth);

const patientSchema = z.object({
  patientId: z.string().min(3).max(32).regex(/^[a-zA-Z0-9-]+$/),
  fullName: z.string().min(2).max(160),
  email: z.string().email().max(254).optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  dateOfBirth: z.string().optional()
});

router.get('/', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 100);
  const filter = q ? { $or: [
    { patientId: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
    { fullName: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
  ] } : {};
  const patients = await Patient.find(filter).sort({ updatedAt: -1 }).limit(100).select('patientId fullName email status createdAt updatedAt');
  res.json({ patients });
}));

router.post('/', allowRoles('admin', 'doctor'), asyncHandler(async (req, res) => {
  const parsed = patientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Please check the patient details.', errors: parsed.error.flatten() });
  const data = parsed.data;
  const patient = await Patient.create({
    ...data, patientId: data.patientId.toUpperCase(),
    dateOfBirth: data.dateOfBirth || undefined, createdBy: req.user._id
  });
  await writeAudit(req, 'create', 'patient', patient._id);
  res.status(201).json({ patient });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found.' });
  const entries = await CareEntry.find({ patient: patient._id, ...(req.user.role === 'doctor' ? {} : { visibility: 'care-team' }) })
    .populate('createdBy', 'name role').sort({ createdAt: -1 }).limit(200);
  await writeAudit(req, 'read', 'patient', patient._id);
  res.json({ patient, entries });
}));

router.post('/:id/entries', asyncHandler(async (req, res) => {
  const schema = z.object({
    category: z.enum(['consultation','medical-report','nutrition','yoga','meditation','follow-up','general']),
    title: z.string().min(2).max(180),
    note: z.string().min(2).max(10000),
    visibility: z.enum(['care-team','doctor-only']).optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid care update.', errors: parsed.error.flatten() });
  if (parsed.data.visibility === 'doctor-only' && req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only a doctor or administrator can create doctor-only notes.' });
  }
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found.' });
  const entry = await CareEntry.create({ ...parsed.data, patient: patient._id, createdBy: req.user._id });
  await writeAudit(req, 'create', 'care-entry', entry._id);
  res.status(201).json({ entry });
}));

export default router;
