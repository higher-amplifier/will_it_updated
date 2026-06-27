const router = require('express').Router()
const Will = require('../models/Will')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')
const { encrypt, decrypt } = require('../utils/encryption')

router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const wills = await Will.find({ user: req.user._id })
    res.json({ wills })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, content, nomineeEmail, nomineeName } = req.body
    const user = await User.findById(req.user._id)
    const encryptedContent = encrypt(content)
    const will = await Will.create({
      user: req.user._id,
      title,
      encryptedContent,
      nomineeEmail,
      nomineeName,
      deliverAfterDays: user.checkinInterval,
    })
    res.status(201).json({ will })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const will = await Will.findOne({ _id: req.params.id, user: req.user._id })
    if (!will) return res.status(404).json({ message: 'Not found' })
    const content = decrypt(will.encryptedContent)
    res.json({ will: { ...will.toObject(), content } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, content, nomineeEmail, nomineeName } = req.body
    const encryptedContent = encrypt(content)
    const will = await Will.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, encryptedContent, nomineeEmail, nomineeName, lastModified: new Date() },
      { new: true }
    )
    if (!will) return res.status(404).json({ message: 'Not found' })
    res.json({ will })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Will.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router