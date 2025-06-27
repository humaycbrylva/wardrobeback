import User from '../models/userModel.js';

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin || user.email !== 'humaycebrayilova146@gmail.com') {
      return res.status(403).json({ message: 'İcazə yoxdur' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};

export default isAdmin;

