const asyncHandler = require('express-async-handler');
const Product = require('../products/product.model'); // We need this!

// 1. Initialize Stripe with your SECRET key
// This key must come from your .env file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('FATAL ERROR: STRIPE_SECRET_KEY is not defined in .env file');
}

// --- Create a new Stripe Checkout Session ---
// @route   POST /api/v1/payment/create-checkout-session
const createCheckoutSession = asyncHandler(async (req, res) => {
  // 1. Get the cart items from the request body
  const { cartItems, orderId } = req.body; // We'll need the orderId
  const user = req.user;

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('No cart items provided.');
  }
  if (!orderId) {
    res.status(400);
    throw new Error('No order ID provided.');
  }

  // 2. --- SECURITY STEP ---
  // Transform cartItems into Stripe's 'line_items' format.
  // We MUST fetch the price from our own database to prevent a "price-tampering" attack.
  const line_items = await Promise.all(
    cartItems.map(async (item) => {
      // Find the product in our DB
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }

      // Use the price from *our database*, not the request body
      return {
        price_data: {
          currency: 'usd', // Change to your currency
          product_data: {
            name: product.name,
            images: [product.image], // Stripe can show the image
          },
          unit_amount: product.price * 100, // Price in *cents*
        },
        quantity: item.qty,
      };
    })
  );

  // 3. Define the URLs for success and cancel
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const successUrl = `${frontendUrl}/order/${orderId}?payment=success`;
  const cancelUrl = `${frontendUrl}/order/${orderId}?payment=cancelled`;

  // 4. Create the Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: user.email, // Pre-fill the user's email
    // 5. --- CRITICAL STEP ---
    // Store the orderId in Stripe's metadata so the webhook can find it
    metadata: {
      orderId: orderId,
    },
  });
  
  

  // 6. Send the session URL back to the frontend
  // The frontend will *redirect* the user to this URL
  res.status(200).json({ url: session.url, id: session.id });
});

module.exports = {
  createCheckoutSession,
};