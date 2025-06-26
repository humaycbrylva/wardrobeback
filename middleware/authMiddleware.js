import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('TOKEN ERROR:', err);
      return res.status(403).json({ message: 'Token etibarsızdır' });
    }
    req.userId = decoded.id;
    next();
  });
};
