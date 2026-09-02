async function pingMicroservice() {
  console.log('Pinging Microservice...');
  try {
    const response = await fetch('http://localhost:4000/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'aura_gym_whatsapp_secret_key_123',
        phone: '+919518573595', // Aditya's phone
        message: 'TEST: Ping from the local script! 🚀'
      })
    });

    const data = await response.text();
    console.log('Microservice Response:', response.status, data);
  } catch (err) {
    console.error('Ping Failed:', err);
  }
}

pingMicroservice();
