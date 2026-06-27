const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth')
const User = require('../models/User')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('OAuth error:', err.message)
        return res.redirect(`${process.env.CLIENT_URL}/login?error=1`)
      }
      if (!user) {
        console.error('No user returned, info:', info)
        return res.redirect(`${process.env.CLIENT_URL}/login?error=1`)
      }
      const token = signToken(user._id)
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    })(req, res, next)
  }
)

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

router.patch('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { checkinInterval: req.body.checkinInterval }, { new: true })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router