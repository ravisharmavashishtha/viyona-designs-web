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

async function scanInbox() {
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  const emails = [];
  
  try {
    const searchResult = await client.search({ all: true }, { uid: true });
    console.log('Total emails in inbox:', (searchResult || []).length);
    
    // Get the most recent 30 emails
    const uids = (searchResult || []).slice(-30);
    
    for await (const msg of client.fetch(uids, { envelope: true, bodyStructure: true, flags: true })) {
      emails.push({
        uid: msg.uid,
        isRead: msg.flags.has('\\Seen'),
        from: msg.envelope.from?.[0]?.address || 'Unknown',
        fromName: msg.envelope.from?.[0]?.name || '',
        to: msg.envelope.to?.map(t => t.address).join(', ') || '',
        subject: msg.envelope.subject || 'No Subject',
        date: msg.envelope.date
      });
    }
  } finally {
    lock.release();
    await client.logout();
  }

  console.log('=== RECENT 30 EMAILS IN INBOX (NEWEST FIRST) ===');
  console.log(JSON.stringify(emails.reverse(), null, 2));
}

scanInbox();
