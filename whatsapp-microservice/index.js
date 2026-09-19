require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
app.use(express.json()); // Allow JSON payloads

// Initialize WhatsApp Web Client
const client = new Client({
    authStrategy: new LocalAuth(), // Saves the login session so you don't have to scan QR every time
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] // Required for running on platforms like Render
    },
    webVersionCache: {
        type: "remote",
        remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html"
    }
});

let currentQR = null;
let isConnected = false;

// Event: Generate QR Code (Ignored in favor of Pairing Code)
client.on('qr', (qr) => {
    // We keep the qr event handler so whatsapp-web.js doesn't crash, 
    // but we no longer generate or display a QR code.
    console.log('\n[WhatsApp] Waiting for pairing code request...');
});

// Event: Client successfully connected
client.on('ready', () => {
    isConnected = true;
    console.log('\n✅ Aura Gym WhatsApp Bot is READY and connected!');
});

// Event: Client disconnected
client.on('disconnected', (reason) => {
    isConnected = false;
    console.log('❌ WhatsApp Client was disconnected:', reason);
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// Start the client
console.log('Initializing WhatsApp Web Puppeteer (this takes 10-15 seconds)...');
client.initialize().catch(err => {
    console.error('CRITICAL ERROR INITIALIZING PUPPETEER:', err);
});

// ---------------------------------------------------------
// PING ENDPOINT: UptimeRobot calls this every 5 minutes
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.status(200).send('Aura Gym WhatsApp Bot is awake! 🟢');
});

// ---------------------------------------------------------
// STATUS ENDPOINT: Check if WhatsApp is actually connected
// ---------------------------------------------------------
app.get('/api/status', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({ 
        connected: isConnected,
        status: isConnected ? 'connected' : 'disconnected'
    });
});

// ---------------------------------------------------------
// PAIRING ENDPOINT: Request 8-character code
// ---------------------------------------------------------
app.post('/api/pair', async (req, res) => {
    try {
        const { secret, phone } = req.body;
        if (secret !== process.env.MICROSERVICE_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!phone) {
            return res.status(400).json({ error: 'Missing phone' });
        }

        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

        console.log(`[WhatsApp] Requesting pairing code for ${cleanPhone}...`);
        const code = await client.requestPairingCode(cleanPhone);
        console.log(`[WhatsApp] Pairing code generated: ${code}`);

        res.status(200).json({ code });
    } catch (error) {
        console.error('Failed to request pairing code:', error);
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// API ENDPOINT: Vercel calls this to send messages
// ---------------------------------------------------------
app.post('/api/send', async (req, res) => {
    try {
        const { secret, phone, message } = req.body;

        // Security check (Prevent unauthorized people from using your bot)
        if (secret !== process.env.MICROSERVICE_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!phone || !message) {
            return res.status(400).json({ error: 'Missing phone or message' });
        }

        // Format phone number for WhatsApp Web JS (requires country code + @c.us)
        let cleanPhone = phone.replace(/\D/g, '');
        
        // Auto-prefix Indian country code (91) if it's exactly 10 digits
        if (cleanPhone.length === 10) {
            cleanPhone = '91' + cleanPhone;
        }
        
        // CRITICAL FIX: We must call getNumberId first to resolve the user's LID in the new WhatsApp architecture
        const numberDetails = await client.getNumberId(cleanPhone);
        if (!numberDetails) {
            return res.status(400).json({ error: 'Phone number is not registered on WhatsApp' });
        }

        // Send the message using the securely resolved serialized ID
        await client.sendMessage(numberDetails._serialized, message);
        console.log(`📤 Sent message to ${cleanPhone}`);

        res.status(200).json({ success: true, message: 'Message sent!' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// LOGOUT ENDPOINT: Disconnect WhatsApp to link a new number
// ---------------------------------------------------------
app.post('/api/logout', async (req, res) => {
    try {
        const { secret } = req.body;
        if (secret !== process.env.MICROSERVICE_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        console.log('[WhatsApp] Logging out...');
        await client.logout();
        isConnected = false;
        
        // Wait a few seconds, then initialize again to allow a new connection
        setTimeout(() => {
            console.log('[WhatsApp] Reinitializing client after logout...');
            client.initialize().catch(err => console.error(err));
        }, 5000);
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Failed to logout:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 WhatsApp Microservice running on port ${PORT}`);
});
