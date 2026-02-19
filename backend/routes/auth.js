const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000');
    }
);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Public
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:3000');
    });
});

// @route   GET /api/auth/current_user
// @desc    Get current user
// @access  Private
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;
