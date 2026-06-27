const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  googleId: { type: String, required: true, unique: true },
  avatar: { type: String },
  checkinInterval: { type: Number, default: 180 },
  lastCheckin: { type: Date, default: Date.now },
  checkinToken: { type: String },
  isActive: { type: Boolean, default: true },
  triggerFired: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
