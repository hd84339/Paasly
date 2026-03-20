const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photoURL: profile.photos[0].value,
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email.toLowerCase() });
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                if (!user.passwordHash) {
                    return done(null, false, { message: 'Account exists but no password set (possibly Google login?)' });
                }

                const isMatch = await bcrypt.compare(password, user.passwordHash);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
