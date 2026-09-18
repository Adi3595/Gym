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
  // Check if Fast2SMS environment variable is set
  if (!process.env.FAST2SMS_API_KEY) {
    console.warn('[SMS SKIPPED] FAST2SMS_API_KEY not configured in .env.local');
    console.log(`[MOCK SMS TO ${phone}]: ${message}`);
    return;
  }

  try {
    // Fast2SMS requires a 10-digit number without country code usually
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        language: "english",
        flash: 0,
        numbers: finalPhone
      })
    });

    if (!response.ok) {
      console.error('[FAST2SMS ERROR]', await response.text());
    } else {
      console.log(`[SMS SENT] Successfully sent SMS via Fast2SMS to ${finalPhone}`);
    }
  } catch (err) {
    console.error('[FAST2SMS FETCH ERROR]', err);
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
