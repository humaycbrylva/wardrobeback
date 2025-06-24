import Message from '../models/Message.js';
import User from '../models/userModel.js';

// Yeni mesaj yarat
export const createMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Məlumatlar natamamdır' });
    }

    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      text,
    });

    const saved = await message.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error('Mesaj göndərmə xətası:', error);
    res.status(500).json({ message: 'Server xətası' });
  }
};

// İki istifadəçi arasındakı mesajları al
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Mesajları alma xətası:', error);
    res.status(500).json({ message: 'Server xətası' });
  }
};
