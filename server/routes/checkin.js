const router = require('express').Router()
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')
const { sendCheckinConfirmation } = require('../utils/mailer')

router.post('/now', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      lastCheckin: new Date(),
      triggerFired: false,
    })
    res.json({ message: 'Checked in successfully', lastCheckin: new Date() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/token/:token', async (req, res) => {
  try {
    const user = await User.findOne({ checkinToken: req.params.token })
    if (!user) return res.status(404).json({ message: 'Invalid or expired link' })

    await User.findByIdAndUpdate(user._id, {
      lastCheckin: new Date(),
      checkinToken: null,
      triggerFired: false,
    })

    try { await sendCheckinConfirmation(user) } catch (_) {}

    res.json({ message: 'Checked in! Your letter remains safe.', name: user.name })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const daysSince = Math.floor(
      (Date.now() - new Date(user.lastCheckin).getTime()) / (1000 * 60 * 60 * 24)
    )
    const daysLeft = Math.max(0, user.checkinInterval - daysSince)
    const pct = Math.min(100, Math.round((daysSince / user.checkinInterval) * 100))

    res.json({
      lastCheckin: user.lastCheckin,
      daysSince,
      daysLeft,
      checkinInterval: user.checkinInterval,
      dangerPercent: pct,
      triggerFired: user.triggerFired,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
