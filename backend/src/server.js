import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import teamRoutes from './routes/team.js';

const required = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_ORIGIN'];
for (const key of required) if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters.');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN.split(',').map(x => x.trim()), credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'dr-mehta-wellness-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/team', teamRoutes);

app.use((err, _req, res, _next) => {
  if (err?.code === 11000) return res.status(409).json({ message: 'A record with this unique value already exists.' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (email && password && password.length >= 12 && !(await User.exists({ email }))) {
    await User.create({
      name: 'Workspace Administrator', email,
      passwordHash: await bcrypt.hash(password, 12), role: 'admin'
    });
    console.log(`Bootstrap administrator created: ${email}. Change the password before real use.`);
  }
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => console.log(`Dr Mehta Wellness API listening on port ${port}`));
}
bootstrap().catch(err => { console.error('API startup failed:', err); process.exit(1); });
