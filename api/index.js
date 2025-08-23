require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Langsung connect ke MONGO_URI dari Environment Variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB terhubung...'))
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err));

// Path ke routes tidak perlu diubah karena mereka relatif terhadap file ini
app.use('/api/auth', require('./routes/auth'));
app.use('/api/aspirations', require('./routes/aspirations'));

// Hapus baris app.listen dan ganti dengan module.exports
// Vercel akan menangani servernya secara otomatis
module.exports = app;