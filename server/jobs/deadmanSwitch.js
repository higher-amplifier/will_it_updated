const cron = require('node-cron')
const crypto = require('crypto')
const User = require('../models/User')
const Will = require('../models/Will')
const { sendCheckinReminder, sendWillToNominee } = require('../utils/mailer')
const { decrypt } = require('../utils/encryption')

cron.schedule('0 4 * * *', async () => {
  console.log('Running dead man switch check...')

  const users = await User.find({ isActive: true })

  for (const user of users) {
    const daysSinceCheckin = (Date.now() - new Date(user.lastCheckin).getTime()) / (1000 * 60 * 60 * 24)

    const wills = await Will.find({ user: user._id, isDelivered: false })
    if (!wills.length) continue

    for (const will of wills) {
      if (daysSinceCheckin >= will.deliverAfterDays) {
        try {
          await sendWillToNominee(
            { email: will.nomineeEmail, name: will.nomineeName },
            user.name,
            [{ title: will.title, content: decrypt(will.encryptedContent) }]
          )
          await Will.findByIdAndUpdate(will._id, { isDelivered: true, deliveredAt: new Date() })
          console.log(`Will "${will.title}" delivered for ${user.email}`)
        } catch (err) {
          console.error(`Failed: ${will.title} for ${user.email}:`, err.message)
        }
      }
    }

    const minDays = Math.min(...wills.map(w => w.deliverAfterDays))
    const reminderDay = minDays * 0.8
    if (daysSinceCheckin >= reminderDay && daysSinceCheckin < minDays) {
      const token = crypto.randomBytes(32).toString('hex')
      await User.findByIdAndUpdate(user._id, { checkinToken: token })
      const checkinLink = `${process.env.CLIENT_URL}/checkin/${token}`
      try {
        await sendCheckinReminder(user, checkinLink)
        console.log(`Reminder sent to ${user.email}`)
      } catch (err) {
        console.error(`Reminder failed for ${user.email}:`, err.message)
      }
    }
  }
})