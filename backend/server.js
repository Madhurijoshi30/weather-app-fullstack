require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const weatherRoutes    = require('./routes/weather');
const authRoutes       = require('./routes/auth');
const favouriteRoutes  = require('./routes/favourites');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',                          // local dev
    process.env.FRONTEND_URL,                         // production Vercel URL
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api',            weatherRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('DB connection failed:', err));