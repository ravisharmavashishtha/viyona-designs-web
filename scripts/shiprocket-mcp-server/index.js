#!/usr/bin/env node
/**
 * Shiprocket Logistics & Courier MCP Server for Viyona Designs
 * Integrates with Shiprocket API v2 (Delhivery, Bluedart, Shadowfax, DTDC, Ekart)
 *
 * Tools:
 * - shiprocket_check_serviceability (Calculate rates & delivery timelines for any Pincode)
 * - shiprocket_create_order (Create custom direct / collab shipping order)
 * - shiprocket_track_shipment (Track shipment via AWB or Order ID)
 * - shiprocket_get_account_balance (Check active wallet balance)
 * - shiprocket_list_orders (List recent orders & delivery statuses)
 * - shiprocket_generate_label (Download/view shipping label for order)
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
let cachedToken = null;
let tokenExpiry = 0;

function getCredentials() {
  let email = process.env.SHIPROCKET_EMAIL || '';
  let password = process.env.SHIPROCKET_PASSWORD || '';
  if (!email || !password) {
    try {
      const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const env = config.mcpServers?.['shiprocket-logistics']?.env;
        if (env) {
          email = env.SHIPROCKET_EMAIL || email;
          password = env.SHIPROCKET_PASSWORD || password;
        }
      }
    } catch (e) {}
  }
  return { email, password };
}

const TOOLS = [
  {
    name: 'shiprocket_check_serviceability',
    description: 'Checks courier serviceability, calculates shipping rates (Delhivery, Bluedart, etc.), COD availability, and estimated delivery dates for any Indian delivery pincode from Mainpuri (205001).',
    inputSchema: {
      type: 'object',
      properties: {
        delivery_pincode: {
          type: 'string',
          description: 'Destination 6-digit delivery pincode (e.g. "411057", "802133")'
        },
        pickup_pincode: {
          type: 'string',
          description: 'Pickup pincode (default: "205001" Mainpuri, UP)'
        },
        weight_kg: {
          type: 'number',
          description: 'Gross parcel weight in kg (default: 0.4 kg)'
        },
        is_cod: {
          type: 'boolean',
          description: 'Whether the order is Cash on Delivery (COD)'
        },
        declared_value: {
          type: 'number',
          description: 'Declared order value in INR (e.g. 550, 1199)'
        }
      },
      required: ['delivery_pincode']
    }
  },
  {
    name: 'shiprocket_create_order',
    description: 'Creates a new custom order / shipment in Shiprocket for a customer or creator collaboration dispatch.',
    inputSchema: {
      type: 'object',
      properties: {
        customer_name: { type: 'string', description: 'Customer first & last name' },
        customer_phone: { type: 'string', description: '10-digit mobile number' },
        customer_email: { type: 'string', description: 'Customer email address' },
        delivery_address: { type: 'string', description: 'Complete street delivery address' },
        city: { type: 'string', description: 'Delivery city' },
        state: { type: 'string', description: 'Delivery state' },
        pincode: { type: 'string', description: '6-digit destination pincode' },
        product_name: { type: 'string', description: 'Name of the product' },
        sku: { type: 'string', description: 'SKU code' },
        price: { type: 'number', description: 'Item price before discount' },
        discount: { type: 'number', description: 'Discount in INR (e.g. 1199 for 100% discount)' },
        payment_method: { type: 'string', enum: ['Prepaid', 'COD'], description: 'Payment method' },
        weight_kg: { type: 'number', description: 'Weight in kg' },
        length_cm: { type: 'number', description: 'Length in cm' },
        breadth_cm: { type: 'number', description: 'Breadth in cm' },
        height_cm: { type: 'number', description: 'Height in cm' },
        pickup_location: { type: 'string', description: 'Pickup location nickname (default: "work")' }
      },
      required: ['customer_name', 'customer_phone', 'delivery_address', 'city', 'state', 'pincode', 'product_name']
    }
  },
  {
    name: 'shiprocket_track_shipment',
    description: 'Tracks real-time live location, courier checkpoint scans, and delivery ETA for an AWB or Order ID.',
    inputSchema: {
      type: 'object',
      properties: {
        awb_code: { type: 'string', description: 'Air Waybill (AWB) tracking number' },
        order_id: { type: 'string', description: 'Shiprocket or Channel Order ID' }
      }
    }
  },
  {
    name: 'shiprocket_get_account_balance',
    description: 'Checks the current Shiprocket prepaid shipping wallet balance.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'shiprocket_list_orders',
    description: 'Lists recent shipments, in-transit parcels, and delivery statuses.',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Optional filter: DELIVERED, IN_TRANSIT, OUT_FOR_DELIVERY, RTO, NEW' },
        per_page: { type: 'number', description: 'Number of orders to retrieve (default: 10)' }
      }
    }
  },
  {
    name: 'shiprocket_generate_label',
    description: 'Generates and retrieves the printable shipping label PDF URL for a shipment.',
    inputSchema: {
      type: 'object',
      properties: {
        shipment_id: { type: 'string', description: 'Shiprocket Shipment ID' }
      },
      required: ['shipment_id']
    }
  }
];

async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 300) {
    return cachedToken;
  }

  const { email, password } = getCredentials();
  if (!email || !password) {
    return null;
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      cachedToken = data.token;
      tokenExpiry = now + 86400;
      return cachedToken;
    }
  } catch (e) {
    console.error('Shiprocket login error:', e.message);
  }
  return null;
}

async function handleToolCall(name, args) {
  const token = await getAuthToken();

  // 1. Serviceability & Courier Rates
  if (name === 'shiprocket_check_serviceability') {
    const pickup = args.pickup_pincode || '205001';
    const delivery = args.delivery_pincode;
    const weight = args.weight_kg || 0.4;
    const cod = args.is_cod ? 1 : 0;
    const val = args.declared_value || 550;

    if (token) {
      const url = `${SHIPROCKET_API_BASE}/courier/serviceability/?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=${weight}&cod=${cod}&declared_value=${val}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      return await res.json();
    }

    return { error: 'Authentication required' };
  }

  // 2. Create Order
  if (name === 'shiprocket_create_order') {
    if (!token) {
      return { success: false, requires_auth: true, message: 'Shiprocket authentication failed.' };
    }

    const orderId = `VD-COL-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const orderDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    const names = args.customer_name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || 'Customer';

    const price = args.price || 1199;
    const discount = args.discount !== undefined ? args.discount : 0;
    const netAmount = Math.max(0, price - discount);

    const payload = {
      order_id: orderId,
      order_date: orderDate,
      pickup_location: args.pickup_location || 'work',
      channel_id: '',
      comment: 'Creator Collaboration Barter Order - Viyona Designs',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: args.delivery_address,
      billing_city: args.city,
      billing_pincode: args.pincode,
      billing_state: args.state,
      billing_country: 'India',
      billing_email: args.customer_email || 'viyonadesigns@gmail.com',
      billing_phone: args.customer_phone,
      shipping_is_billing: true,
      order_items: [
        {
          name: args.product_name,
          sku: args.sku || 'VD-GANESHA-WHT-01',
          units: 1,
          selling_price: price,
          discount: discount,
          tax: 0
        }
      ],
      payment_method: args.payment_method || 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: discount,
      sub_total: netAmount,
      length: args.length_cm || 17.8,
      breadth: args.breadth_cm || 10.2,
      height: args.height_cm || 8.9,
      weight: args.weight_kg || 0.4
    };

    const res = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data;
  }

  // 3. Track Shipment
  if (name === 'shiprocket_track_shipment') {
    if (!token) return { success: false, requires_auth: true };
    const query = args.awb_code ? `awb/${args.awb_code}` : `orders/details/${args.order_id}`;
    const res = await fetch(`${SHIPROCKET_API_BASE}/courier/track/${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }

  // 4. Wallet Balance
  if (name === 'shiprocket_get_account_balance') {
    if (!token) return { success: false, requires_auth: true };
    const res = await fetch(`${SHIPROCKET_API_BASE}/wallet/get-balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }

  // 5. List Orders
  if (name === 'shiprocket_list_orders') {
    if (!token) return { success: false, requires_auth: true };
    const query = args.status ? `?status=${args.status}` : `?per_page=${args.per_page || 10}`;
    const res = await fetch(`${SHIPROCKET_API_BASE}/orders${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }

  // 6. Generate Label
  if (name === 'shiprocket_generate_label') {
    if (!token) return { success: false, requires_auth: true };
    const res = await fetch(`${SHIPROCKET_API_BASE}/courier/generate/label`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipment_id: [args.shipment_id] })
    });
    return await res.json();
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
