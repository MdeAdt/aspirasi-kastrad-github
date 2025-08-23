const mongoose = require('mongoose');
const AspirationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    nama_pengirim: { type: String, required: true },
    npm_pengirim: { type: String, required: true },
    angkatan_pengirim: { type: Number, required: true },
    kelas_pengirim: { type: String, required: true },
    status: { type: String, default: 'Diproses' },
    alasan_penolakan: { type: String, default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Aspiration', AspirationSchema);