import { ImapFlow } from 'imapflow';

async function getEmailTotal() {
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
    const msg = await client.fetchOne(429, { source: true });
    const body = msg.source.toString('utf8');
    
    // Find all price patterns
    const clean = body.replace(/=\r?\n/g, '').replace(/=3D/g, '=');
    const matches = clean.match(/(?:Rs\.?|INR|&#8377;|₹)\s*[\d,]+(?:\.\d{2})?/gi) || [];
    console.log('Price matches found in email:', matches);
    
    // Search around 'Total'
    let pos = 0;
    while ((pos = clean.indexOf('Total', pos)) !== -1) {
      console.log('--- MATCH AT POS', pos, '---');
      console.log(clean.substring(pos, pos + 300).replace(/<[^>]*>/g, ' '));
      pos += 5;
    }
  } finally {
    lock.release();
    await client.logout();
  }
}

getEmailTotal();
