const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({
        message: 'Tidak ada token, akses ditolak'
    });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Token tidak valid'
        });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            message: 'Akses ditolak, bukan admin'
        });
    }
};