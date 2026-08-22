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

async function auditActionItems() {
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  
  try {
    console.log('=== SEARCHING FOR ACTION ITEMS IN INBOX ===');
    
    // 1. Search Amazon Seller emails
    const amzSearch = await client.search({ from: 'amazon' }, { uid: true });
    console.log('Amazon related emails count:', amzSearch.length);
    const recentAmz = amzSearch.slice(-6);
    for await (const msg of client.fetch(recentAmz, { envelope: true })) {
      console.log(`[Amazon] ${msg.envelope.date?.toISOString().slice(0, 10)} | From: ${msg.envelope.from?.[0]?.address} | Subject: ${msg.envelope.subject}`);
    }

    // 2. Search Meta / Facebook emails
    const metaSearch = await client.search({ from: 'facebook' }, { uid: true });
    console.log('\nMeta related emails count:', metaSearch.length);
    const recentMeta = metaSearch.slice(-4);
    for await (const msg of client.fetch(recentMeta, { envelope: true })) {
      console.log(`[Meta] ${msg.envelope.date?.toISOString().slice(0, 10)} | From: ${msg.envelope.from?.[0]?.address} | Subject: ${msg.envelope.subject}`);
    }

    // 3. Search for customer / support keywords
    const supportTerms = ['broken', 'return', 'refund', 'complaint', 'where is', 'track', 'invoice'];
    console.log('\n=== CHECKING CUSTOMER ESCALATIONS ===');
    for (const term of supportTerms) {
      const termSearch = await client.search({ body: term }, { uid: true });
      console.log(`Keyword "${term}" matches: ${termSearch.length}`);
    }

  } finally {
    lock.release();
    await client.logout();
  }
}

auditActionItems();
