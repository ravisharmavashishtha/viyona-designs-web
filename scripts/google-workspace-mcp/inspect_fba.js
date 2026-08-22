import { ImapFlow } from 'imapflow';

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

async function inspectFBA() {
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  
  try {
    console.log('=== SEARCHING FBA EMAILS ===');
    const search = await client.search({ body: 'FBA15M7B4W3J' }, { uid: true });
    console.log('Found matches:', search);
    
    for (const uid of search) {
      for await (const msg of client.fetch([uid], { envelope: true, bodyParts: ['text'] })) {
        console.log('\n--- EMAIL ---');
        console.log('Subject:', msg.envelope.subject);
        console.log('Date:', msg.envelope.date);
        console.log('From:', msg.envelope.from?.[0]?.address);
      }
    }

    // Also search for recent emails from seller central
    const scSearch = await client.search({ from: 'seller-notification@amazon' }, { uid: true });
    console.log('Seller notification matches:', scSearch.length);
  } finally {
    lock.release();
    await client.logout();
  }
}

inspectFBA();
