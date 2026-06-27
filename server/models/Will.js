const mongoose = require('mongoose')

const willSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  encryptedContent: { type: String, required: true },
  nomineeEmail: { type: String, required: true },
  nomineeName: { type: String, required: true },
  deliverAfterDays: { type: Number, required: true, default: 180 },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  lastModified: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Will', willSchema)