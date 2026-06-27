const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const passport = require('./middleware/passport')
const authRoutes = require('./routes/auth')
const willRoutes = require('./routes/will')
const checkinRoutes = require('./routes/checkin')

require('./jobs/deadmanSwitch')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(passport.initialize())

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use('/api/auth', authRoutes)
app.use('/api/will', willRoutes)
app.use('/api/checkin', checkinRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log("✅ MongoDB Connected");

  require("./jobs/deadmanSwitch");

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server on ${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:");
  console.error(err);
});