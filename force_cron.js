require('dotenv').config({ path: '.env.local' });

const microserviceUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
const microserviceSecret = process.env.MICROSERVICE_SECRET || 'smfitness_gym_whatsapp_secret_key_123';

const phone = '9518573595';
const memberFirstName = 'Test';

const cronMessage = `*SMFITNESS GYM - MEMBERSHIP UPDATE*\n\nDear *${memberFirstName}*,\n\n[ENGLISH]\nOur records indicate that your SMFitness Gym membership expired 10 days ago. We have sincerely missed your presence at the facility! We invite you to visit the front desk to renew your membership so we can continue supporting your fitness goals.\n\n[मराठी]\nआमच्या रेकॉर्डनुसार, तुमची एसएम फिटनेस जिम मेंबरशिप १० दिवसांपूर्वी संपली आहे. आम्ही तुम्हाला जिममध्ये खूप मिस करत आहोत! मेंबरशिपचे नूतनीकरण (renew) करण्यासाठी लवकरात लवकर रिसेप्शनला भेट द्या.\n\n[हिंदी]\nहमारे रिकॉर्ड के अनुसार, आपकी एसएम फिटनेस जिम की मेंबरशिप 10 दिन पहले समाप्त हो गई है। हम आपको जिम में बहुत मिस कर रहे हैं! अपनी मेंबरशिप का नवीनीकरण (renew) करने के लिए कृपया जल्द से जल्द रिसेप्शन पर आएं।\n\nHope to see you soon! / लवकरच भेटूया!\n*SMFitness Gym Management*`;

async function sendWhatsApp() {
  console.log('Sending CRON WhatsApp to', phone);
  try {
    const response = await fetch(microserviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: microserviceSecret,
        phone: phone,
        message: cronMessage
      })
    });
    const text = await response.text();
    console.log('WhatsApp Response:', response.status, text);
  } catch (err) {
    console.error('WhatsApp Error:', err.message);
  }
}

async function sendSMS() {
  console.log('Sending CRON Fast2SMS to', phone);
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
        message: cronMessage,
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
