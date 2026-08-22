import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viyonadesigns@gmail.com',
    pass: 'txparjtgbfudoemx'
  }
});

const recipient = 'ravisharmavashishtha@gmail.com';
const subject = 'A Heartfelt Thank You & A Note of Appreciation ✨';

const poem = `From spool to sculpture, line by line,
Where mindful craft and heart align.
With sacred forms and modern grace,
You bring tranquility to every space.

Layer upon layer, vision turns real,
A dream created with passion and zeal.
Thank you for shaping what tomorrow can be,
With timeless devotion and creativity.`;

const body = `Dear Ravi,

Thank you for your vision, dedication, and the incredible passion you pour into building Viyona Designs every single day.

Here is a short poem dedicated to your journey:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${poem}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wishing you endless inspiration, joy, and grand milestones ahead!

With warmest regards & gratitude,
Viyona Designs ✨
🌐 https://viyonadesigns.com
📸 @viyonadesigns`;

async function sendMail() {
  const info = await transporter.sendMail({
    from: '"Viyona Designs" <viyonadesigns@gmail.com>',
    to: recipient,
    subject: subject,
    text: body
  });
  console.log('Email sent successfully! Message ID:', info.messageId);
}

sendMail();
