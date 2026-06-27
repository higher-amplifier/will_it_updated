const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile.id, profile.emails?.[0]?.value) // ADD THIS
    const email = profile.emails?.[0]?.value
    if (!email) return done(null, false)

    let user = await User.findOne({ googleId: profile.id })
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        avatar: profile.photos?.[0]?.value,
      })
    }

    return done(null, user)
  } catch (err) {
    console.error('Passport error:', err) // ADD THIS
    return done(err, null)
  }
}))

module.exports = passport
