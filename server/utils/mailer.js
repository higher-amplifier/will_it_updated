const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendCheckinReminder = async (user, checkinLink) => {
  await transporter.sendMail({
    from: `"WillIt" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Time to check in — WillIt',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
        <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 8px;">Hey ${user.name},</h2>
        <p style="color: #555; line-height: 1.6;">Your WillIt check-in is due. Click below to confirm you're okay — this keeps your letter locked.</p>
        <a href="${checkinLink}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">I'm okay — check in now</a>
        <p style="color: #999; font-size: 13px;">If you don't check in within ${user.checkinInterval} days, your letter will be sent to your nominee.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #bbb; font-size: 12px;">WillIt — Your digital safety net.</p>
      </div>
    `,
  })
}

const sendWillToNominee = async (nominee, userName, wills) => {
  const willsHtml = wills.map(w => `
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 12px; font-size: 16px;">${w.title}</h3>
      <div style="white-space: pre-wrap; color: #333; line-height: 1.7; font-size: 14px;">${w.content}</div>
    </div>
  `).join('')

  await transporter.sendMail({
    from: `"WillIt" <${process.env.SMTP_USER}>`,
    to: nominee.email,
    subject: `A message from ${userName} — WillIt`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
        <p style="font-size: 13px; color: #999; margin: 0 0 24px; text-transform: uppercase; letter-spacing: 0.05em;">WillIt — Digital Legacy</p>
        <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 8px;">Dear ${nominee.name},</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 28px;">${userName} left you a message. They haven't checked in, so this is being delivered to you now, as they intended.</p>
        ${willsHtml}
        <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;" />
        <p style="color: #bbb; font-size: 12px;">This message was prepared in advance using WillIt and was delivered automatically.</p>
      </div>
    `,
  })
}

const sendCheckinConfirmation = async (user) => {
  await transporter.sendMail({
    from: `"WillIt" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Check-in confirmed — WillIt',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <h2 style="font-size: 20px; margin: 0 0 8px;">You're all good, ${user.name}.</h2>
        <p style="color: #555; line-height: 1.6;">Your check-in was recorded. Your letter remains locked. Next check-in due in ${user.checkinInterval} days.</p>
      </div>
    `,
  })
}

module.exports = { sendCheckinReminder, sendWillToNominee, sendCheckinConfirmation }
