import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlantısı uğurludur');
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB bağlantı xətası:', err));
