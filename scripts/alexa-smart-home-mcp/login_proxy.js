import AlexaRemote from 'alexa-remote2';
import fs from 'node:fs';

const cookiePath = 'd:/DevSpace/3dprintingbusiness/scripts/alexa-smart-home-mcp/alexa_cookie.json';
const pcIp = '192.168.1.12';
const port = 3456;

const alexa = new AlexaRemote();

console.log('================================================================');
console.log(`🚀 Starting Alexa Direct Login Proxy for Mobile at http://${pcIp}:${port}`);
console.log('================================================================');
console.log(`👉 Open http://${pcIp}:${port} on your mobile browser (Chrome/Safari)`);

alexa.init({
  proxyOnly: true,
  proxyOwnIp: pcIp,
  proxyPort: port,
  proxyListenBind: '0.0.0.0',
  amazonPage: 'amazon.in',
  alexaServiceHost: 'layla.amazon.in',
  acceptLanguage: 'en-IN'
}, (err) => {
  if (err && !err.message?.includes('Please open')) {
    console.error('❌ Proxy Init Error:', err);
    return;
  }

  console.log('\n🎉 Amazon.in Login Successful via Mobile!');
  console.log('Direct Amazon Alexa Session Cookie acquired.');

  const authData = {
    cookie: alexa.cookie,
    csrf: alexa.csrf,
    amazonPage: 'amazon.in',
    alexaServiceHost: 'layla.amazon.in',
    savedAt: new Date().toISOString()
  };

  fs.writeFileSync(cookiePath, JSON.stringify(authData, null, 2), 'utf8');
  console.log('Saved direct session credentials to:', cookiePath);

  alexa.getDevices((err, devices) => {
    if (!err && devices?.devices) {
      console.log('\n📱 Discovered Alexa Echo Devices & Smart Home:');
      for (const dev of devices.devices) {
        if (dev.accountName) {
          console.log(`- ${dev.accountName} (${dev.deviceFamily || 'Device'}, Online: ${dev.online})`);
        }
      }
    }
    console.log('\n✅ Setup Complete! You can close your mobile browser.');
  });
});
