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

  const english = `*SMFitness Gym - Purchase Receipt* 🏋️‍♂️\n\nHi ${receiptData.customerName},\nThank you for shopping with us!\n\n*🧾 Order Summary:*\n${itemsList}\n\n*💰 Total Paid:* ${formatCurrency(receiptData.totalAmount)}\n\nStay fit, stay strong! 💪\n- SMFitness Gym & Supplements`;
  
  const hindi = `*SMFitness Gym - रसीद* 🏋️‍♂️\n\nनमस्ते ${receiptData.customerName},\nहमारे साथ खरीदारी करने के लिए धन्यवाद!\n\n*🧾 ऑर्डर विवरण:*\n${itemsList}\n\n*💰 कुल भुगतान:* ${formatCurrency(receiptData.totalAmount)}\n\nस्वस्थ रहें, मजबूत रहें! 💪\n- SMFitness Gym & Supplements`;
  
  const marathi = `*SMFitness Gym - पावती* 🏋️‍♂️\n\nनमस्कार ${receiptData.customerName},\nआमच्याकडून खरेदी केल्याबद्दल धन्यवाद!\n\n*🧾 ऑर्डर तपशील:*\n${itemsList}\n\n*💰 एकूण भरलेली रक्कम:* ${formatCurrency(receiptData.totalAmount)}\n\nनिरोगी राहा, मजबूत राहा! 💪\n- SMFitness Gym & Supplements`;

  const textMessage = `${english}\n\n---\n\n${hindi}\n\n---\n\n${marathi}`;

  await sendWhatsAppMessage(phone, textMessage);
};

export const sendSubscriptionNotification = async (phone: string, subData: {
  customerName: string,
  planName: string,
  endDate: string,
  amount: number
}) => {
  if (!phone) return;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  const formattedDate = new Date(subData.endDate).toLocaleDateString('en-IN');

  const english = `*SMFitness Gym - Subscription Active* 🏋️‍♂️\n\nHi ${subData.customerName},\nYour gym subscription for *${subData.planName}* is now active!\n\n*💰 Amount Paid:* ${formatCurrency(subData.amount)}\n*📅 Valid Until:* ${formattedDate}\n\nLet's crush those fitness goals! 💪\n- SMFitness Gym`;
  
  const hindi = `*SMFitness Gym - सदस्यता सक्रिय* 🏋️‍♂️\n\nनमस्ते ${subData.customerName},\nआपकी *${subData.planName}* की जिम सदस्यता अब सक्रिय है!\n\n*💰 भुगतान की गई राशि:* ${formatCurrency(subData.amount)}\n*📅 वैधता:* ${formattedDate}\n\nआइए मिलकर फिटनेस के लक्ष्य पूरे करें! 💪\n- SMFitness Gym`;
  
  const marathi = `*SMFitness Gym - सबस्क्रिप्शन सक्रिय* 🏋️‍♂️\n\nनमस्कार ${subData.customerName},\nतुमची *${subData.planName}* ची जिम मेंबरशिप आता सुरू झाली आहे!\n\n*💰 भरलेली रक्कम:* ${formatCurrency(subData.amount)}\n*📅 वैधता:* ${formattedDate}\n\nचला, फिटनेसचे ध्येय गाठूया! 💪\n- SMFitness Gym`;

  const textMessage = `${english}\n\n---\n\n${hindi}\n\n---\n\n${marathi}`;

  await sendWhatsAppMessage(phone, textMessage);
};
