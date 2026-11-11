import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.dmw_session || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email role active');
    if (!user || !user.active) return res.status(401).json({ message: 'Session is no longer valid.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' });
  }
}

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }
  next();
};
