const express = require("express");
const app = express();
app.use(express.json());

app.post("/charge", async (req, res) => {
  const { amount, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: token.id,
      description: "Charge for test@example.com",
    });

    res.send("Payment successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment failed");
  }
});

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CM"],
      },
      success_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
    });
    console.log(session);

    return res.status(200).json({ sessionURL: session.url, session });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
