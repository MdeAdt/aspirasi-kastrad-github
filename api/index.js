// File: api/index.js (Versi Tes Sederhana)
const express = require('express');
const app = express();

// Endpoint ini hanya untuk mengetes apakah file ini berjalan
app.get('/api/test', (req, res) => {
  console.log("--- TES BERHASIL! --- Permintaan diterima di endpoint /api/test.");
  res.status(200).json({ message: 'Halo dari backend Vercel! Konfigurasi Anda sudah benar.' });
});

// Ini akan menangkap semua permintaan lain ke /api/
app.all('/api/*', (req, res) => {
    console.log(`--- LOG --- Menerima permintaan untuk: ${req.method} ${req.originalUrl}`);
    res.status(500).json({ error: 'Endpoint ini belum difungsikan dalam mode tes.' });
});

module.exports = app;