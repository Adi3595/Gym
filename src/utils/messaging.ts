// The URL where your WhatsApp microservice is hosted
const microserviceUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
const microserviceSecret = process.env.MICROSERVICE_SECRET || 'aura_gym_whatsapp_secret_key_123';

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

export const sendReceiptNotification = async (phone: string, receiptData: { 
  customerName: string, 
  totalAmount: number,
  items: { name: string, quantity: number, price: number }[]
}) => {
  if (!phone) return;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  let itemsList = receiptData.items.map(item => `▪ ${item.quantity}x ${item.name} - ${formatCurrency(item.price)}`).join('\n');

  const textMessage = `*SMFitness Gym - Purchase Receipt* 🏋️‍♂️\n\nHi ${receiptData.customerName},\nThank you for shopping with us!\n\n*🧾 Order Summary:*\n${itemsList}\n\n*💰 Total Paid:* ${formatCurrency(receiptData.totalAmount)}\n\nStay fit, stay strong! 💪\n- SMFitness Gym & Supplements`;

  // Send to WhatsApp
  await sendWhatsAppMessage(phone, textMessage);
};
