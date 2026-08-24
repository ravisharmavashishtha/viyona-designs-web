import { ImapFlow } from 'imapflow';

async function getConfirmationLink() {
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
    const status = await client.status('INBOX', { messages: true });
    const count = status.messages;
    console.log(`Total messages in INBOX: ${count}`);
    
    for (let i = count - 2; i <= count; i++) {
      const msg = await client.fetchOne(i, { envelope: true, source: true });
      console.log(`=== Message ${i}: ${msg.envelope.subject} ===`);
      const body = msg.source.toString('utf8');
      
      const clean = body.replace(/=\r?\n/g, '').replace(/=3D/g, '=');
      const links = clean.match(/https?:\/\/[^\s\"\'<>]+/gi) || [];
      const verifyLinks = links.filter(l => l.includes('verify') || l.includes('confirm') || l.includes('token') || l.includes('shiprocket.in'));
      console.log('Action / Verification Links:\n', verifyLinks);
    }

  } finally {
    lock.release();
    await client.logout();
  }
}

getConfirmationLink();
