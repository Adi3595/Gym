require('dotenv').config({ path: '.env.local' });

const microserviceUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
const microserviceSecret = process.env.MICROSERVICE_SECRET || 'smfitness_gym_whatsapp_secret_key_123';

const phone = '9518573595';
const testMessage = '*SMFITNESS GYM - TEST MESSAGE*\n\nHello! This is a test message to verify your WhatsApp and SMS integrations are working correctly.\n\nThank you,\nSMFitness Admin';

async function sendWhatsApp() {
  console.log('Sending WhatsApp to', phone);
  try {
    const response = await fetch(microserviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: microserviceSecret,
        phone: phone,
        message: testMessage
      })
    });
    const text = await response.text();
    console.log('WhatsApp Response:', response.status, text);
  } catch (err) {
    console.error('WhatsApp Error:', err.message);
  }
}

async function sendSMS() {
  console.log('Sending Fast2SMS to', phone);
  if (!process.env.FAST2SMS_API_KEY) {
    console.log('No FAST2SMS_API_KEY found in .env.local');
    return;
  }
  
  try {
    const finalPhone = phone.replace(/\D/g, '').slice(-10);
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "q",
        message: testMessage,
        language: "english",
        flash: 0,
        numbers: finalPhone
      })
    });
    const result = await response.text();
    console.log('Fast2SMS Response:', response.status, result);
  } catch (err) {
    console.error('Fast2SMS Error:', err.message);
  }
}

async function main() {
  await sendWhatsApp();
  await sendSMS();
}

main();
