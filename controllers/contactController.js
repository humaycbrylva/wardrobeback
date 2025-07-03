import ContactRequest from '../models/ContactRequest.js';
import nodemailer from 'nodemailer';
import { io } from '../server.js'; // Socket.io instance (backend server-da export edilib)

export const createContactRequest = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: 'Bütün sahələr doldurulmalıdır' });

  try {
    const contact = new ContactRequest({ name, email, message });
    await contact.save();

    // Nodemailer - admin emailinə mesaj göndərmə
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Wardrobe+ İstək" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // admin email config-da ayrıca saxla
      subject: 'Yeni İstək Mesajı',
      text: `Ad: ${name}\nEmail: ${email}\nMesaj: ${message}`
    });

    // Socket.io ilə adminlara real-time xəbərdarlıq
    io.emit('newContactRequest', { id: contact._id, name, email, message });

    res.status(201).json({ message: 'Mesajınız uğurla göndərildi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};

export const getContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'İstək mesajları gətirilə bilmədi' });
  }
};

export const markRequestRead = async (req, res) => {
  const { id } = req.params;
  try {
    await ContactRequest.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'İstək oxundu kimi işarələndi' });
  } catch (err) {
    res.status(500).json({ message: 'İstək oxundu kimi işarələnmədi' });
  }
};
