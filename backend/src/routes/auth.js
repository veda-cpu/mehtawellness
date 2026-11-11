import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeAudit } from '../middleware/audit.js';

const router = Router();
const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200)
});

router.post('/login', asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Enter a valid email and password.' });
  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && user.active && await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Email or password is incorrect.' });

  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
  res.cookie('dmw_session', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: 8 * 60 * 60 * 1000, path: '/'
  });
  await writeAudit(req, 'login', 'user', user._id);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  await writeAudit(req, 'logout', 'user', req.user._id);
  res.clearCookie('dmw_session', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
  res.json({ message: 'Signed out.' });
}));

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

export default router;
