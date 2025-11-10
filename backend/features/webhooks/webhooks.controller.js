const asyncHandler = require('express-async-handler');
const orderService = require('../orders/order.service'); // We need this!

// 1. Initialize Stripe with your SECRET key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 2. Get your Webhook Secret from the .env file
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.error('FATAL ERROR: STRIPE_WEBHOOK_SECRET is not defined in .env file');
}

// --- Handle Incoming Stripe Webhook ---
// @route   POST /api/v1/webhooks/stripe
const handleStripeWebhook = asyncHandler(async (req, res) => {
  // 1. Get the signature from the headers
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // 2. Verify the event is 100% from Stripe
    //    We MUST use 'req.rawBody' which we'll set up in app.js
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    // If signature is invalid
    console.error('Webhook signature verification failed.', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
  

  // 3. Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // 4. Get the orderId from our metadata
    const orderId = session.metadata.orderId;

    // 5. Create the paymentResult object
    const paymentResult = {
      id: session.payment_intent,
      status: session.status,
      update_time: session.created, // Use session creation time
      email_address: session.customer_details.email,
    };

    try {
      // 6. Call our Order Service to update the order
      await orderService.markOrderAsPaid(orderId, paymentResult);
      console.log(`Order ${orderId} has been marked as paid.`);
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
      // If this fails, Stripe will retry.
      // Send a 500 so Stripe knows to try again.
      res.status(500).json({ error: 'Failed to update order.' });
      return;
    }
  } else {
    // Handle other event types if you want
    console.log(`Unhandled event type ${event.type}`);
  }

  // 7. Send a 200 OK back to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
});

module.exports = {
  handleStripeWebhook,
};