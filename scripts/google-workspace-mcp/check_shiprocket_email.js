import { ImapFlow } from 'imapflow';

async function checkShiprocketVerification() {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: 'viyonadesigns@gmail.com', pass: 'txparjtgbfudoemx' },
    logger: false
  });

  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    const messages = [];
    for await (let msg of client.fetch('1:*', { envelope: true, source: true }, { uid: false })) {
      messages.push(msg);
    }
    
    const shiprocketMsgs = messages.filter(m => {
      const from = m.envelope.from?.[0]?.address || '';
      const subj = m.envelope.subject || '';
      return from.toLowerCase().includes('shiprocket') || subj.toLowerCase().includes('shiprocket');
    });

    console.log(`Found ${shiprocketMsgs.length} Shiprocket emails:`);
    shiprocketMsgs.slice(-5).forEach(m => {
      console.log(`Date: ${m.envelope.date} | From: ${m.envelope.from?.[0]?.address} | Subject: ${m.envelope.subject}`);
    });

  } finally {
    lock.release();
    await client.logout();
  }
}

checkShiprocketVerification();
