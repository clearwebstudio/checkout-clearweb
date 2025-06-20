import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
console.log("Stripe-Key beginnt mit:", process.env.STRIPE_SECRET_KEY.slice(0, 10));
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY ? '✅ Loaded' : '❌ Missing');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

 // deinen Live-Key hier einfügen

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Preisliste (aus Webflow)
const prices = {
  start: 'price_1RbllhDEGiMYKyReY5nkD4AA',
  plus: 'price_1RblmsDEGiMYKyRej80n3H4k',
  premium: 'price_1RblnQDEGiMYKyRexqHOs009',
  seo: 'price_1RblotDEGiMYKyReoyQ82udf',
  page: 'price_1RblpfDEGiMYKyReTY5EgI3h',
  cms: 'price_1RblqpDEGiMYKyReAs8t85pi',
  support: 'price_1RbltJDEGiMYKyReAUv0TXnD',
  image: 'price_1RbluoDEGiMYKyReH9fommXO',
  express: 'price_1RblsSDEGiMYKyRe5Sb4tEWL'
};

// Checkout-Route
app.get('/', async (req, res) => {
  let { pkg, addons } = req.query;
if (typeof pkg === 'object' && pkg.pkg) pkg = pkg.pkg;
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
console.log('📦 Paket:', pkg);
console.log('➕ Add-ons:', selectedAddons);
console.log('🧾 Line Items:', line_items);
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
