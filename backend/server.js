require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB terhubung...'))
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/aspirations', require('./routes/aspirations'));

// PENTING: Untuk Vercel, kita export 'app'
module.exports = app;