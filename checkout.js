import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
console.log("Stripe-Key beginnt mit:", process.env.STRIPE_SECRET_KEY?.slice(0, 10));
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 // deinen Live-Key hier einfügen

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Preisliste (aus Webflow)
const prices = {
  start: 'prod_SWpQ3x019FymNW',
  plus: 'prod_SWpRlpLot42dri',
  premium: 'prod_SWpSxdUKF7mKKi',
  seo: 'prod_SWpTdzlGxddS01',
  page: 'prod_SWpUcNxXb48nVn',
  cms: 'prod_SWpV9aAIgVO1tA',
  support: 'prod_SWpYTgTLL7ta1U',
  image: 'prod_SWpZ4sFFa1Pzng',
  express: 'prod_SWpXyx5Ic6bL5a'
};

// Checkout-Route
app.get('/', async (req, res) => {
  const { pkg, addons } = req.query;
  const selectedAddons = Array.isArray(addons) ? addons : JSON.parse(addons || '[]');

  try {
    const line_items = [];

    if (pkg && prices[pkg]) {
      line_items.push({ price: prices[pkg], quantity: 1 });
    }

    selectedAddons.forEach(addon => {
      const id = prices[addon];
      if (id) line_items.push({ price: id, quantity: 1 });
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: 'https://clearweb.studio/success',
      cancel_url: 'https://clearweb.studio/#cancel',
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating Stripe session');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server ready at http://localhost:${PORT}`);
});
