const express = require('express');
const router = express.Router();
const {
    createAspiration,
    getMyAspirations,
    getAdminAspirations,
    updateAspirationStatus,
    deleteAspiration
} = require('../controllers/aspirationController');
const {
    protect,
    admin
} = require('../middleware/authMiddleware');

router.post('/', protect, createAspiration);
router.get('/my-history', protect, getMyAspirations);
router.get('/admin', protect, admin, getAdminAspirations);
router.put('/admin/:id', protect, admin, updateAspirationStatus);
router.delete('/admin/:id', protect, admin, deleteAspiration);

module.exports = router;