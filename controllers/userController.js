// controllers/userController.js
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server xətası' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { name, style, gender } = req.body;

    const updatedData = {
      name,
      style,
      gender,
    };

    // Əgər yeni şəkil yüklənibsə
    if (req.file) {
      updatedData.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Profil yenilənmə xətası:', err);
    res.status(500).json({ message: 'Profil yenilənə bilmədi' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Yeni şifrələr uyğun deyil' });
    }

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Cari şifrə yanlışdır' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Şifrə uğurla dəyişdirildi' });

  } catch (err) {
    console.error('Şifrə dəyişmə xətası:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email');
    res.json({ users, currentUserId: req.userId });
  } catch (error) {
    res.status(500).json({ message: 'Server xətası' });
  }
};


