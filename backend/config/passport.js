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
                const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
                
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: email,
                    photoURL: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                };

                try {
                    // Try to find user by email first, to prevent duplicate key errors
                    // if they previously signed up manually with the same email.
                    let user = null;
                    if (email) {
                        user = await User.findOne({ email: email.toLowerCase() });
                    }
                    
                    if (!user) {
                        user = await User.findOne({ googleId: profile.id });
                    }

                    if (user) {
                        // If user found but no googleId (manual signup), link the googleId
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            if (!user.photoURL && newUser.photoURL) {
                                user.photoURL = newUser.photoURL;
                            }
                            await user.save();
                        }
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
