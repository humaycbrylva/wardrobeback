import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS ayarı
app.use(cors({
  origin: 'http://localhost:5177',
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', chatRoutes);

// MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı uğurludur');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5177',
        methods: ['GET', 'POST'],
        credentials: true,
        transports: ['websocket', 'polling'],
      },
      allowEIO3: true,
    });

    const onlineUsers = new Map();

    io.on('connection', (socket) => {
      console.log('🔌 Yeni istifadəçi qoşuldu:', socket.id);

      socket.on('addUser', (userId) => {
        if (!userId) {
          console.log('⚠️ addUser ilə boş userId gəldi');
          return;
        }
        onlineUsers.set(userId, socket.id);
        console.log('✅ addUser ilə əlavə edildi:', userId);
        console.log('🔵 Online istifadəçilər:', [...onlineUsers.entries()]);
      });

      socket.on('sendMessage', (data) => {
        console.log('📤 Gələn mesaj:', data);
        const receiverSocketId = onlineUsers.get(data.receiverId);

        console.log('🎯 Axtarılan receiverId:', data.receiverId);
        console.log('📡 Mövcud onlineUsers:', [...onlineUsers.entries()]);
        console.log('🎯 receiverSocketId tapıldı:', receiverSocketId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', data);
          console.log('✅ Mesaj göndərildi:', data.text);
        } else {
          console.log('⚠️ receiverSocketId tapılmadı – istifadəçi offline və ya userId səhvdir');
        }
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            console.log('❌ İstifadəçi ayrıldı və silindi:', userId);
            break;
          }
        }
        console.log('❌ Socket bağlantısı kəsildi:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda işləyir`);
    });

  })
  .catch((err) => {
    console.error('❌ MongoDB bağlantı xətası:', err.message);
  });

