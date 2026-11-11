import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/User.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { writeAudit } from '../middleware/audit.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(requireAuth, allowRoles('admin'));

router.get('/', asyncHandler(async (_req, res) => {
  const users = await User.find().select('name email role active createdAt').sort({ name: 1 });
  res.json({ users });
}));

router.post('/', asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(254),
    password: z.string().min(12).max(200),
    role: z.enum(['admin','doctor','nutritionist','yoga','meditation'])
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid team member details.', errors: parsed.error.flatten() });
  const { name, email, password, role } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role });
  await writeAudit(req, 'create', 'user', user._id);
  res.status(201).json({ user: { id: user._id, name, email, role } });
}));

export default router;
