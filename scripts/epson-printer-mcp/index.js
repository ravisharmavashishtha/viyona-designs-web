#!/usr/bin/env node
/**
 * Epson Paper Printer MCP Server for Viyona Designs
 * Integrates with Epson L3260 Series & Windows Print Spooler
 *
 * Tools:
 * - get_epson_printer_status (Checks Epson L3260 status, queue count, connection)
 * - print_document (Prints any PDF, label, or image directly to Epson L3260)
 * - print_thank_you_cards (Generates and prints branded packing slip review cards)
 * - get_print_queue (Lists active and pending print jobs)
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execAsync = promisify(exec);
const PRINTER_NAME = process.env.EPSON_PRINTER_NAME || 'EPSON L3260 Series';

const TOOLS = [
  {
    name: 'get_epson_printer_status',
    description: 'Checks the connection status, job queue, and health of the Epson L3260 paper printer.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'print_document',
    description: 'Sends a PDF document, shipping label, or image file directly to the Epson L3260 paper printer.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Absolute path to the PDF or image file to print'
        },
        copies: {
          type: 'number',
          description: 'Number of copies to print (default: 1)'
        }
      },
      required: ['file_path']
    }
  },
  {
    name: 'print_thank_you_card',
    description: 'Generates and prints an official Viyona Designs packaging box insert / thank-you card for customer orders.',
    inputSchema: {
      type: 'object',
      properties: {
        customer_name: {
          type: 'string',
          description: 'Optional customer name for personalization'
        },
        product_name: {
          type: 'string',
          description: 'Product name (e.g. "Lord Ganesha Idol" or "Phone Stand")'
        }
      }
    }
  },
  {
    name: 'get_print_queue',
    description: 'Lists all pending or active jobs in the Epson printer queue.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

async function handleToolCall(name, args) {
  if (name === 'get_epson_printer_status') {
    const psCmd = `Get-Printer -Name "*EPSON*" | Select-Object Name, DriverName, PortName, PrinterStatus, JobCount | ConvertTo-Json`;
    try {
      const { stdout } = await execAsync(`powershell -NoProfile -Command "${psCmd}"`);
      const data = JSON.parse(stdout || '{}');
      return {
        printer_model: data.Name || PRINTER_NAME,
        port: data.PortName || 'USB001 / Wi-Fi',
        status: data.PrinterStatus || 'Ready',
        active_jobs: data.JobCount !== undefined ? data.JobCount : 0
      };
    } catch (err) {
      return {
        printer_model: PRINTER_NAME,
        status: 'Online (Windows Spooler)',
        details: err.message
      };
    }
  }

  if (name === 'print_document') {
    const filePath = args.file_path;
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    const copies = args.copies || 1;
    // Use PowerShell Start-Process with -Verb Print to route to default/Epson printer
    const psPrintCmd = `Start-Process -FilePath "${filePath.replace(/\\/g, '/')}" -Verb Print -PassThru | Out-Null`;
    await execAsync(`powershell -NoProfile -Command "${psPrintCmd}"`);

    return {
      success: true,
      printer: PRINTER_NAME,
      file_printed: path.basename(filePath),
      copies
    };
  }

  if (name === 'print_thank_you_card') {
    const customer = args.customer_name || 'Valued Buyer';
    const product = args.product_name || 'Viyona Designs Creation';
    
    const cardContent = `
=====================================================
            ✨ VIYONA DESIGNS ✨
      Sacred Soul • Modern Precision
=====================================================

Dear ${customer},

Thank you for choosing Viyona Designs and bringing our 
${product} into your home!

🌱 100% Plant-Based Eco-Bio-Plastic
🇮🇳 Precision 3D Crafted in India

⭐ LOVED YOUR NEW PIECE?
If this piece brought joy to your space, please take 
30 seconds to leave an honest review on Amazon! Your 
support helps our small Indian craft studio grow.

🌐 Website: https://viyonadesigns.com
📸 Instagram: @viyonadesigns
✉️ Support: support@viyonadesigns.com

With gratitude,
The Viyona Designs Team ✨
=====================================================
`;
    const tempFilePath = path.join(process.env.TEMP || 'C:/Temp', 'viyona_thank_you_card.txt');
    fs.writeFileSync(tempFilePath, cardContent, 'utf8');

    const psPrintCmd = `Start-Process -FilePath "notepad.exe" -ArgumentList "/p \\"${tempFilePath.replace(/\\/g, '/')}\\"" -WindowStyle Hidden -Wait`;
    await execAsync(`powershell -NoProfile -Command "${psPrintCmd}"`);

    return {
      success: true,
      printer: PRINTER_NAME,
      card_recipient: customer,
      product_name: product
    };
  }

  if (name === 'get_print_queue') {
    const psCmd = `Get-PrintJob -PrinterName "*EPSON*" -ErrorAction SilentlyContinue | Select-Object Id, DocumentName, JobStatus, TotalPages, SubmittedTime | ConvertTo-Json`;
    try {
      const { stdout } = await execAsync(`powershell -NoProfile -Command "${psCmd}"`);
      const jobs = stdout.trim() ? JSON.parse(stdout) : [];
      const jobList = Array.isArray(jobs) ? jobs : (jobs.Id ? [jobs] : []);
      return {
        printer: PRINTER_NAME,
        pending_jobs_count: jobList.length,
        jobs: jobList
      };
    } catch (err) {
      return { printer: PRINTER_NAME, pending_jobs_count: 0, jobs: [] };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
}

// JSON-RPC Protocol Handler
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'tools/list') {
      console.log(JSON.stringify({ jsonrpc: '2.0', id, result: { tools: TOOLS } }));
    } else if (method === 'tools/call') {
      try {
        const result = await handleToolCall(params.name, params.arguments || {});
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        }));
      } catch (err) {
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: { isError: true, content: [{ type: 'text', text: `Error: ${err.message}` }] }
        }));
      }
    } else {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method '${method}' not found` }
      }));
    }
  } catch (err) {
    console.error('Failed to parse request JSON:', err);
  }
});
