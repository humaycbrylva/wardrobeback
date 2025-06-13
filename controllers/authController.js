import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateTokens } from '../utils/token.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, gender, birthday, stylePreference, profileEmoji, profileColor } = req.body;
    const profileImage = req.file ? req.file.filename : '';

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Zəruri sahələr boş ola bilməz' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email artıq istifadə olunur' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      birthday,
      stylePreference,
      profileImage,
      profileEmoji,
      profileColor
    });

    const tokens = generateTokens(user);
    res.status(201).json({ accessToken: tokens.accessToken });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'İstifadəçi tapılmadı' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Şifrə yanlışdır' });

    const tokens = generateTokens(user);
    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Profil tapılmadı' });
    res.json(user);
  } catch (err) {
    console.error('PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};
