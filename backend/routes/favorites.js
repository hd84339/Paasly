const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware: ensure user is authenticated
function requireAuth(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    next();
}

// GET /api/favorites  — return current user's favorite shop IDs
router.get('/', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('favorites');
        res.json(user.favorites || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/favorites/:shopId  — add a shop to favorites
router.post('/:shopId', requireAuth, async (req, res) => {
    const shopId = parseInt(req.params.shopId);
    if (isNaN(shopId)) return res.status(400).json({ message: 'Invalid shop ID' });

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favorites: shopId } },
            { new: true }
        ).select('favorites');
        res.json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/favorites/:shopId  — remove a shop from favorites
router.delete('/:shopId', requireAuth, async (req, res) => {
    const shopId = parseInt(req.params.shopId);
    if (isNaN(shopId)) return res.status(400).json({ message: 'Invalid shop ID' });

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favorites: shopId } },
            { new: true }
        ).select('favorites');
        res.json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
