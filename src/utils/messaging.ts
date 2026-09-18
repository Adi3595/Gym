import twilio from 'twilio';

// The URL where your WhatsApp microservice is hosted
const microserviceUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
const microserviceSecret = process.env.MICROSERVICE_SECRET || 'smfitness_gym_whatsapp_secret_key_123';

export const sendWhatsAppMessage = async (phone: string, message: string) => {
  try {
    const response = await fetch(microserviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: microserviceSecret,
        phone: phone,
        message: message
      })
    });

    if (!response.ok) {
       console.error('[WHATSAPP MICROSERVICE ERROR]', await response.text());
    }
  } catch (err) {
    console.error('[WHATSAPP MICROSERVICE FETCH ERROR]', err);
  }
};

export const sendSMSMessage = async (phone: string, message: string) => {
  // Check if Twilio environment variables are set
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('[SMS SKIPPED] Twilio credentials not fully configured in .env.local');
    console.log(`[MOCK SMS TO ${phone}]: ${message}`);
    return;
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}` // Assume India (+91) if no country code
    });
    console.log(`[SMS SENT] Successfully sent SMS to ${phone}`);
  } catch (err) {
    console.error('[TWILIO SMS ERROR]', err);
  }
};

export const sendReceiptNotification = async (phone: string, receiptData: { 
  customerName: string, 
  totalAmount: number,
  items: { name: string, quantity: number, price: number }[]
}) => {
  if (!phone) return;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  let itemsList = receiptData.items.map(item => `${item.quantity}x ${item.name} - ${formatCurrency(item.price)}`).join('\n');

  const textMessage = `*Aura Gym - Purchase Receipt*\n\nHi ${receiptData.customerName},\nThank you for your purchase!\n\n*Order Details:*\n${itemsList}\n\n*Total Paid:* ${formatCurrency(receiptData.totalAmount)}\n\nHave a great workout!\n- Aura Gym Team`;

  // Send to both WhatsApp and SMS
  await sendWhatsAppMessage(phone, textMessage);
  await sendSMSMessage(phone, textMessage);
};
