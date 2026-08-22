import fs from 'node:fs';

const metaToken = 'EAAMsMD8wdIABSXSaZCt3WjJbbRci6KSiIK3eOIWYFjr7ML7OidURTivcMeFpn5EFzfomi0kq0ePW3PdTrdZABzGglwuxbju3jQc05kNPZAqoZBqmRfiT1upVvVc3ZB88FnDnSKeP8LvYkbdhGSl4V4NWmHvi8NV2AeMxBZCL0nN16Q7hyf4u1ZApE1WSBhK8SHTvAZDZD';
const pageId = '1225203720674649';
const igUserId = '17841447302983726';

const caption = `Begin every morning with divine calm and positive energy. 🪔🤍

Our signature Lord Ganesha Idol is precision-crafted in India using 100% plant-based bio-materials with a flawless matte finish.

Perfect for your Mandir, Living Room, or Work Desk.

🛒 Available now on Amazon (Launch Offer: ₹550).
Tap the link in our bio to order 👉 @viyonadesigns

#viyonadesigns #ganesha #modernmandir #sacredspaces #interiordecor #ecofriendlyliving #madeinindia #homedecorindia`;

async function publishPost() {
  const imageBuffer = fs.readFileSync('d:/DevSpace/3dprintingbusiness/public/images/actual_ganesha_mandir_promo.jpg');
  
  // 1. Upload photo directly to Facebook Page
  const formData = new FormData();
  formData.append('source', new Blob([imageBuffer], { type: 'image/jpeg' }), 'ganesha_mandir.jpg');
  formData.append('message', caption);
  formData.append('published', 'true');
  formData.append('access_token', metaToken);

  console.log('Uploading photo to Facebook Page...');
  const fbRes = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/photos', {
    method: 'POST',
    body: formData
  });
  const fbData = await fbRes.json();
  console.log('Facebook Upload Result:\n', JSON.stringify(fbData, null, 2));

  // 2. Fetch Facebook CDN public URL for Instagram container
  if (fbData.id) {
    const photoRes = await fetch('https://graph.facebook.com/v19.0/' + fbData.id + '?fields=images&access_token=' + metaToken);
    const photoData = await photoRes.json();
    const publicUrl = photoData.images?.[0]?.source;
    console.log('Facebook Hosted Image URL for Instagram:\n', publicUrl);

    if (publicUrl) {
      console.log('Creating Instagram media container...');
      const igContainerRes = await fetch('https://graph.facebook.com/v19.0/' + igUserId + '/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: publicUrl,
          caption: caption,
          access_token: metaToken
        })
      });
      const igContainerData = await igContainerRes.json();
      console.log('Instagram Container Result:\n', JSON.stringify(igContainerData, null, 2));

      if (igContainerData.id) {
        console.log('Publishing to Instagram...');
        const igPubRes = await fetch('https://graph.facebook.com/v19.0/' + igUserId + '/media_publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: igContainerData.id,
            access_token: metaToken
          })
        });
        const igPubData = await igPubRes.json();
        console.log('Instagram Publish Result:\n', JSON.stringify(igPubData, null, 2));

        if (igPubData.id) {
          // Fetch permalink
          const postRes = await fetch('https://graph.facebook.com/v19.0/' + igPubData.id + '?fields=permalink&access_token=' + metaToken);
          const postData = await postRes.json();
          console.log('Instagram Live Permalink:\n', postData.permalink);
        }
      }
    }
  }
}

publishPost();
