const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', (req, res, next) => {
    const state = req.query.source === 'shopkeeper' ? 'shopkeeper' : 'frontend';
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: state
    })(req, res, next);
});

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to appropriate frontend based on state.
        const state = req.query.state;
        const returnTo = state === 'shopkeeper' ? process.env.SHOPKEEPER_URL : process.env.FRONTEND_URL;
        res.redirect(returnTo);
    }
);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Public
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(req.query.source === 'shopkeeper' ? process.env.SHOPKEEPER_URL : process.env.FRONTEND_URL);
    });
});

// @route   GET /api/auth/current_user
// @desc    Get current user
// @access  Private
router.get('/current_user', (req, res) => {
    res.send(req.user || null);
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: role || 'user',
        });

        await user.save();

        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Login error after signup' });
            res.json(user);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Login user with email and password
// @access  Public
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message || 'Invalid credentials' });

        req.login(user, (err) => {
            if (err) return next(err);
            res.json(user);
        });
    })(req, res, next);
});

module.exports = router;
