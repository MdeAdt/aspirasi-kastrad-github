const Aspiration = require('../models/Aspiration');

exports.createAspiration = async (req, res) => {
    const { title, content, nama_pengirim, npm_pengirim, angkatan_pengirim, kelas_pengirim } = req.body;
    try {
        const newAspiration = new Aspiration({
            title, content, nama_pengirim, npm_pengirim, angkatan_pengirim, kelas_pengirim,
            author: req.user.id,
            status: 'Diproses'
        });
        await newAspiration.save();
        res.status(201).json({ message: 'Aspirasi berhasil dikirim!' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getMyAspirations = async (req, res) => {
    try {
        const aspirations = await Aspiration.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(aspirations);
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getAdminAspirations = async (req, res) => {
    try {
        const aspirations = await Aspiration.find().sort({ createdAt: -1 }).populate('author', 'name email');
        res.json(aspirations);
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateAspirationStatus = async (req, res) => {
    const { status, alasan_penolakan } = req.body;
    try {
        const aspiration = await Aspiration.findById(req.params.id);
        if (!aspiration) return res.status(404).json({ message: 'Aspirasi tidak ditemukan' });

        aspiration.status = status;
        aspiration.alasan_penolakan = (status === 'Ditolak') ? alasan_penolakan : null;
        await aspiration.save();
        res.json({ message: 'Status berhasil diperbarui' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteAspiration = async (req, res) => {
    try {
        await Aspiration.findByIdAndDelete(req.params.id);
        res.json({ message: 'Aspirasi berhasil dihapus' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};