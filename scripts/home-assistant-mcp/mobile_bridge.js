import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';

const logFile = 'd:/DevSpace/homeassistant_config/mobile_bridge.log';
function log(msg) {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {}
}

log('Starting Unbreakable Mobile Bridge...');

// Permanent heartbeat timer so the event loop NEVER exits
setInterval(() => {}, 1000 * 60 * 60);

process.on('uncaughtException', (err) => {
  log(`Caught Exception (prevented crash): ${err.stack || err.message}`);
});

process.on('unhandledRejection', (reason) => {
  log(`Caught Rejection (prevented crash): ${reason}`);
});

const LISTEN_PORT = 8124;
const TARGET_HOST = '127.0.0.1';
const TARGET_PORT = 8123;

const server = http.createServer((req, res) => {
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${TARGET_HOST}:${TARGET_PORT}`
    }
  };

  const proxy = http.request(options, (targetRes) => {
    try {
      res.writeHead(targetRes.statusCode, targetRes.headers);
      targetRes.pipe(res, { end: true });
    } catch (e) {}
  });

  proxy.on('error', (err) => {
    log(`HTTP Proxy Error: ${err.message}`);
    try {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Bridge Error: ${err.message}`);
      }
    } catch (e) {}
  });

  req.on('error', () => {});
  res.on('error', () => {});

  req.pipe(proxy, { end: true });
});

server.on('upgrade', (req, socket, head) => {
  socket.on('error', () => {});
  const targetSocket = net.connect(TARGET_PORT, TARGET_HOST, () => {
    try {
      targetSocket.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
        Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n') + '\r\n\r\n');
      if (head && head.length) targetSocket.write(head);
      targetSocket.pipe(socket);
      socket.pipe(targetSocket);
    } catch (e) {}
  });

  targetSocket.on('error', () => {
    try { socket.destroy(); } catch (e) {}
  });
  socket.on('error', () => {
    try { targetSocket.destroy(); } catch (e) {}
  });
});

server.on('error', (err) => {
  log(`Server error: ${err.message}`);
});

server.listen(LISTEN_PORT, '0.0.0.0', () => {
  log(`🚀 Unbreakable Mobile Bridge Live on 0.0.0.0:${LISTEN_PORT}`);
});
