import net from 'node:net';

const ip = '192.168.1.18';
const port = 9100;

const poemContent = `
======================================================================
                     🌸 TO MY BELOVED MEENU 🌸
             "Every Dream Begins and Blossoms With You"
======================================================================

तुम्हारी एक मुस्कान से, दिन की शुरुआत होती है,
जब तुम साथ होती हो, तो हर बात में बात होती है।

सपनों के इस सफ़र में, तुम ही मेरी ताक़त हो,
हर मुश्किल राह में, मेरी सबसे ख़ूबसूरत आदत हो।

हाथों में तेरा हाथ हो, तो कायनात अपनी लगती है,
तुझसे ही ये घर, ये दुनिया, और ये ज़िंदगी सजती है।

'वियोना' की हर रचना में, तेरे प्यार का ही रंग है,
ईश्वर का सबसे प्यारा तोहफ़ा, हर पल तेरा संग है।

----------------------------------------------------------------------
You are my peace in the chaos, my strength in every storm,
With you by my side, every house becomes a loving home.

Forever and always, yours. ❤️
— Ravi
======================================================================
             ✨ Viyona Designs Studio • Wi-Fi Direct Print ✨
======================================================================
\x0C`;

console.log(`Connecting directly over Wi-Fi to Epson L3260 at ${ip}:${port}...`);

const socket = new net.Socket();
socket.setTimeout(5000);

socket.connect(port, ip, () => {
  console.log('🟢 Connected to Epson Wi-Fi Port 9100!');
  socket.write(poemContent, 'utf8', () => {
    console.log('🎉 Data transmitted successfully! Print job dispatched to Epson L3260.');
    socket.end();
  });
});

socket.on('error', (err) => {
  console.error('❌ Socket error:', err.message);
});

socket.on('timeout', () => {
  console.log('Socket timed out.');
  socket.destroy();
});
