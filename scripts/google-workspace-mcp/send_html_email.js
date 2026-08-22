import fs from 'node:fs';
import nodemailer from 'nodemailer';

const htmlContent = fs.readFileSync('C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/scratch/email_preview.html', 'utf8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viyonadesigns@gmail.com',
    pass: 'txparjtgbfudoemx'
  }
});

const recipient = 'ravisharmavashishtha@gmail.com';
const subject = 'Crafting Tomorrow, One Layer at a Time ✨ — A Tribute to Ravi';

const textFallback = `Dear Ravi,

Building something truly exceptional from the ground up demands vision, relentless dedication, and unmatched passion. Thank you for breathing life into Viyona Designs and creating sacred, functional art for thousands of homes across India.

✨ Dedicated to Your Journey:
“From digital curves to tangible grace,
You shape serenity for every space.
With mindful craft, bio-born and pure,
Art made to inspire, designed to endure.

Layer upon layer, the vision takes flight,
Turning humble spools into sculptures of light.
Thank you for building with courage and soul,
Making beauty and peace the ultimate goal.”

May the road ahead bring grand milestones, continuous peace, and creative triumphs!

Warmest regards & gratitude,
The Viyona Designs Team
https://viyonadesigns.com | @viyonadesigns`;

async function sendHtmlEmail() {
  const info = await transporter.sendMail({
    from: '"Viyona Designs" <viyonadesigns@gmail.com>',
    to: recipient,
    subject: subject,
    text: textFallback,
    html: htmlContent
  });
  console.log('HTML Email successfully dispatched! Message ID:', info.messageId);
}

sendHtmlEmail();
