// middlewares/verifyToken.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Token alındı:', token); // DEBUG: token göstər

  if (!token) {
    console.warn('⛔ Token yoxdur');
    return res.status(401).json({ message: 'Token yoxdur' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded token:', decoded); // DEBUG: decoded obyekt
    req.userId = decoded.id;
    req.user = decoded;  // Əgər decoded.id undefined-dirsə → problem login token strukturundadır
    next();
  } catch (err) {
    console.error('❌ Token yoxlanılmadı:', err.message);
    return res.status(403).json({ message: 'Token yanlışdır və ya vaxtı bitib' });
  }
};
