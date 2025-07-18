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


// Mesaj sil
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Mesaj tapılmadı' });

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Bu mesajı yalnız göndərən silə bilər' });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Mesaj silindi' });
  } catch (err) {
    console.error('Mesaj silinmə xətası:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};


export const updateMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { text } = req.body;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Mesaj tapılmadı' });

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Bu mesajı düzəltmək icazəniz yoxdur' });
    }

    message.text = text;
    message.isEdited = true; // modeldə `isEdited` adıdır
    await message.save();

    res.status(200).json({ message: 'Mesaj uğurla yeniləndi' });
  } catch (err) {
    console.error('Mesaj düzəlişi xətası:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};
