const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    photoURL: {
        type: String,
        default: ''
    },
    passwordHash: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: false,
        unique: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'shop_owner'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    favorites: {
        type: [Number],
        default: []
    }
});

module.exports = mongoose.model('User', UserSchema);
