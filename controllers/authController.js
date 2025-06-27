
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { sendOtp } from '../utils/sendOtp.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, gender, style } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Şifrələr uyğun deyil' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Bu email artıq istifadə olunur' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dəq

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.gender = gender;
      existingUser.style = style;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.profileImage = req.file?.filename;
      
      await existingUser.save();
    } else {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        gender,
        style,
        profileImage: req.file?.filename,
        otp,
        otpExpires,
      });
      await newUser.save();
    }

    await sendOtp(email, otp);
    res.status(200).json({ message: 'OTP email ünvanınıza göndərildi' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xətası' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    if (user.isVerified) return res.status(400).json({ message: 'Artıq təsdiqlənib' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Yanlış OTP kodu' });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP vaxtı bitib' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP təsdiqləndi. Giriş edə bilərsiniz.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};

const loginAttempts = new Map(); // yaddaşda saxlanır: email -> { count, blockedUntil }

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Email qeydiyyatda deyil və ya təsdiqlənməyib' });
    }

    // Bloklama yoxlaması
    const attempt = loginAttempts.get(email);
    if (attempt && attempt.blockedUntil > Date.now()) {
      const timeLeft = Math.ceil((attempt.blockedUntil - Date.now()) / 1000);
      return res.status(429).json({ message: `Çox səhv cəhd etdiniz. ${timeLeft} saniyə gözləyin.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 3 dəfə səhv cəhd yoxlaması
      if (!attempt) {
        loginAttempts.set(email, { count: 1, blockedUntil: 0 });
      } else {
        attempt.count += 1;
        if (attempt.count >= 3) {
          attempt.blockedUntil = Date.now() + 3 * 60 * 1000; // 3 dəq
          attempt.count = 0;
        }
        loginAttempts.set(email, attempt);
      }

      return res.status(400).json({ message: 'Şifrə yanlışdır' });
    }

    // Uğurlu giriş -> əvvəlki cəhdləri sil
    loginAttempts.delete(email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Giriş uğurludur',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        style: user.style,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xətası' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email tapılmadı' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 dəq
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Wardrobe+" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Parol sıfırlama OTP',
      text: `Sizin OTP kodunuz: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP göndərildi' });

  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'OTP yanlışdır və ya vaxtı keçib' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Şifrələr uyğun deyil' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ message: 'Yeni şifrə uğurla təyin edildi' });
  } catch (err) {
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};

