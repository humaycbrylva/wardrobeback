import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token yoxdur' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token yanlışdır və ya vaxtı bitib' });
  }
};
