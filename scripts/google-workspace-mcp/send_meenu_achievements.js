import fs from 'node:fs';
import nodemailer from 'nodemailer';

const htmlContent = fs.readFileSync('C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/scratch/email_meenu_achievements_hindi.html', 'utf8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viyonadesigns@gmail.com',
    pass: 'txparjtgbfudoemx'
  }
});

const recipient = 'meenu@viyonadesigns.com';
const subject = 'Celebrating Our Milestones Together ✨ — A Special Tribute to Meenu';

const textFallback = `Dear Meenu,

Building a brand from zero is a journey of courage, vision, and relentless dedication. Today, as we celebrate how far Viyona Designs has come, thank you for your inspiring guidance and unwavering support behind every milestone.

🏆 Our Milestones & Achievements So Far:
• 40,000+ Shoppers Reached Across India
• 17,000+ Social Likes & Positive Love
• 3 Active Products Live on Amazon (Ganesha, Phone Stand, Puppy Tray)
• 100% On-Time Order Dispatches (Agra, Pune, West Bengal)

✨ आपके समर्पण को समर्पित एक कविता:
“सपनों की मिट्टी से गढ़ा, एक पावन सा आकार,
कला और तकनीक का, ये सुंदर सा संसार।
हर एक परत में बसी हुई, मेहनत और विश्वास,
लाती है हर घर में शांति, और एक नया उल्लास।

आपकी दृष्टि, आपका साहस, हर पल देता संबल,
विद्योना के हर सृजन को, बनाता है ये मंगल।
शुक्रिया इस नए सफर का, साथी बनने के लिए,
हर मंदिर, हर घर को सुंदर, पावन करने के लिए।”

Wishing you endless happiness, health, and grand milestones ahead on this beautiful journey!

Warmest regards & deepest gratitude,
The Viyona Designs Team
https://viyonadesigns.com | @viyonadesigns`;

async function sendEmail() {
  const info = await transporter.sendMail({
    from: '"Viyona Designs" <viyonadesigns@gmail.com>',
    to: recipient,
    subject: subject,
    text: textFallback,
    html: htmlContent
  });
  console.log('Milestones & Hindi Poem Email successfully dispatched! Message ID:', info.messageId);
}

sendEmail();
