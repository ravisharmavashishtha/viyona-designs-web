import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import net from 'node:net';

const execAsync = promisify(exec);

async function scanTapo() {
  console.log('=== 1. WINDOWS ARP TABLE (IP & MAC ADDRESSES) ===');
  const { stdout } = await execAsync('powershell -Command "Get-NetNeighbor -AddressFamily IPv4 | Where-Object { $_.IPAddress -like \'192.168.1.*\' } | Format-Table IPAddress, LinkLayerAddress, State"');
  console.log(stdout);

  console.log('=== 2. PROBING SUBNET 192.168.1.1 - 192.168.1.40 FOR TAPO PORTS (80, 443, 20002) ===');
  const candidates = [];
  for (let i = 1; i <= 40; i++) {
    const ip = `192.168.1.${i}`;
    for (const port of [80, 443, 20002]) {
      await new Promise((resolve) => {
        const sock = new net.Socket();
        sock.setTimeout(250);
        sock.on('connect', () => {
          console.log(`🟢 Active Device Found: ${ip} (Port ${port})`);
          candidates.push({ ip, port });
          sock.destroy();
          resolve();
        });
        sock.on('error', () => { sock.destroy(); resolve(); });
        sock.on('timeout', () => { sock.destroy(); resolve(); });
        sock.connect(port, ip);
      });
    }
  }

  console.log('\n=== 3. TESTING TAPO SIGNATURE ON CANDIDATES ===');
  const uniqueIps = [...new Set(candidates.map(c => c.ip))];
  for (const ip of uniqueIps) {
    if (ip === '192.168.1.1' || ip === '192.168.1.8' || ip === '192.168.1.18') continue; // router, bambu, epson
    try {
      const res = await fetch(`http://${ip}/`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
      const serverHeader = res ? res.headers.get('server') : 'N/A';
      console.log(`Device IP: ${ip} | HTTP Server: ${serverHeader}`);
    } catch (e) {}
  }
}

scanTapo();
