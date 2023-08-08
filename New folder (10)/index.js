const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51NH3g6SCYWZK4a2xmIGQNST1Ulh5Ocx9NyDzH95z174yeczNWGrM97T9Z927VqpwxGCBzhGmdHXKFDpXUJgGKxuH00SF3CnxAh');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:5507', // Replace with your allowed origin
  methods: ['POST'], // Allow specific methods
};
app.use(cors(corsOptions));

// Endpoint to create a Payment Intent
app.post('http://localhost:5503', async (req, res) => {
  
  try {
    const { amount, recipient } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        recipient,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('http://localhost:5507', (req, res) => {
  res.sendFile(__dirname + '/index.js');
});
// Endpoint to process the payment
app.post('https://api.stripe.com/v1', async (req, res) => {
  
  try {
    const { token, amount, recipient } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card','bank','token'],
      payment_method: token,
      metadata: {
        recipient,
      },
    });
    
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5506, () => {
  console.log('Server is running on port 550');
});