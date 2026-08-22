import fs from 'node:fs';
import nodemailer from 'nodemailer';

const htmlContent = fs.readFileSync('C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/scratch/email_meenu_high_contrast.html', 'utf8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viyonadesigns@gmail.com',
    pass: 'txparjtgbfudoemx'
  }
});

const recipient = 'meenu@viyonadesigns.com';
const subject = 'A Special Tribute & Thank You to Meenu ✨ — The Heart of Viyona Designs';

const textFallback = `Dear Meenu,

Building a meaningful brand requires patience, wisdom, and an unwavering heart. Thank you for your leadership, creative grace, and tireless dedication to Viyona Designs.

✨ Dedicated to Meenu:
“With grace in each vision and warmth in each thought,
You nurture the beauty that passion has brought.
From idea to essence, with patience and care,
You bring sacred calm into homes everywhere.

A pillar of strength, of wisdom and light,
Guiding our journey to ever new heights.
Thank you for shaping what Viyona can be,
With timeless devotion, soul, and harmony.”

Wishing you endless happiness, strength, and milestone achievements on this journey!

Warmest regards & deepest gratitude,
The Viyona Designs Team
https://viyonadesigns.com | @viyonadesigns`;

async function resendMeenuEmail() {
  const info = await transporter.sendMail({
    from: '"Viyona Designs" <viyonadesigns@gmail.com>',
    to: recipient,
    subject: subject,
    text: textFallback,
    html: htmlContent
  });
  console.log('High-Contrast Meenu Email successfully resent! Message ID:', info.messageId);
}

resendMeenuEmail();
