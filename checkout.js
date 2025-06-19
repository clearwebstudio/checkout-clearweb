const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Clearweb Checkout API is live!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});// Your Stripe checkout logic will go here
