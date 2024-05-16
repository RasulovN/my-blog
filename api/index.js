import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js'; 
import projectRoutes from './routes/project.route.js'; 
import winRoutes from './routes/win.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path';

dotenv.config();
const app = express();


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(cors())
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/win', winRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


// cookie
app.post('/acceptallcookies', (req, res, next) => {
  const { accepted } = req.body;
  if (accepted) {
    // Kuki muvaffaqiyatli qabul qilindi
    // res.json({ success: true });
    res.send({accepted: true})
  } else {
    res.status(400).json({ success: false });
    console.log("cookie rad etildi")
  }
});
// cookie