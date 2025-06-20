import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Clearweb Checkout API is live');
});

app.post('/create-checkout', async (req, res) => {
  const { packageId, addons, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price * 100,
            product_data: {
              name: 'Clearweb Website Package',
              description: `Package: ${packageId}, Add-ons: ${addons.join(', ')}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: 'https://clearweb.studio/success',
      cancel_url: 'https://clearweb.studio/canceled',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout session creation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
