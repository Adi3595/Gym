require('dotenv').config({ path: '.env.local' });

async function testTwilio() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER.replace('whatsapp:', '');
  const targetPhone = '+918329713663'; // Gaurav

  console.log(`Sending SMS from ${twilioNumber} to ${targetPhone}...`);

  const params = new URLSearchParams();
  params.append('To', targetPhone);
  params.append('From', twilioNumber);
  params.append('Body', 'Testing Aura Gym Twilio SMS Integration 🏋️‍♂️');

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const data = await response.json();
    console.log('Twilio Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

testTwilio();
