import { ImapFlow } from 'imapflow';

async function searchPackagingEmails() {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: 'viyonadesigns@gmail.com',
      pass: 'txparjtgbfudoemx'
    },
    logger: false
  });

  console.log('Connecting to Gmail (viyonadesigns@gmail.com)...');
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    const messages = [];
    for await (let msg of client.fetch('1:*', { envelope: true, source: true }, { uid: false })) {
      messages.push(msg);
    }
    
    console.log(`Total messages in INBOX: ${messages.length}`);
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      const subj = m.envelope.subject || '';
      const from = m.envelope.from?.[0]?.address || '';
      const date = m.envelope.date;
      console.log(`[${i+1}] Date: ${date} | From: ${from} | Subject: ${subj}`);
      
      const body = m.source ? m.source.toString() : '';
      if (body.toLowerCase().includes('corrugated') || body.toLowerCase().includes('box') || body.toLowerCase().includes('packaging') || body.toLowerCase().includes('ordered') || from.includes('amazon')) {
        console.log(`   -> Potential Match! Inspecting snippet:`);
        const lines = body.split('\n').filter(l => l.toLowerCase().includes('rs') || l.toLowerCase().includes('inr') || l.toLowerCase().includes('price') || l.toLowerCase().includes('order') || l.toLowerCase().includes('box'));
        console.log(lines.slice(0, 10).join('\n'));
      }
    }

  } finally {
    lock.release();
    await client.logout();
  }
}

searchPackagingEmails();
