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
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for running on platforms like Render
    }
});

// Event: Generate QR Code for the gym owner to scan
client.on('qr', (qr) => {
    console.log('\n======================================================');
    console.log('📱 SCAN THIS QR CODE WITH YOUR GYM WHATSAPP ACCOUNT:');
    console.log('======================================================\n');
    qrcode.generate(qr, { small: true });
});

// Event: Client successfully connected
client.on('ready', () => {
    console.log('\n✅ Aura Gym WhatsApp Bot is READY and connected!');
});

// Event: Client disconnected
client.on('disconnected', (reason) => {
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
        const cleanPhone = phone.replace(/\D/g, '');
        const chatId = `${cleanPhone}@c.us`;

        // Send the message
        await client.sendMessage(chatId, message);
        console.log(`📤 Sent message to ${cleanPhone}`);

        res.status(200).json({ success: true, message: 'Message sent!' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 WhatsApp Microservice running on port ${PORT}`);
});
