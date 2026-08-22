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

async function inspectCriticalEmails() {
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  
  try {
    const targetUids = [422, 421, 409];
    for (const uid of targetUids) {
      console.log(`\n================== EMAIL UID: ${uid} ==================`);
      for await (const msg of client.fetch([uid], { envelope: true, bodyStructure: true, source: true })) {
        console.log('From:', msg.envelope.from?.[0]?.address);
        console.log('Subject:', msg.envelope.subject);
        console.log('Date:', msg.envelope.date);
        const text = msg.source.toString('utf8');
        // Extract plain text snippet
        console.log('Content Snippet:\n', text.slice(0, 1500));
      }
    }
  } finally {
    lock.release();
    await client.logout();
  }
}

inspectCriticalEmails();
