const mongoose = require('mongoose');

// 1. Define the Order Schema
const orderSchema = new mongoose.Schema(
  {
    // 2. Link to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Creates the relationship to the User model
    },

    // 3. Array of items in the order
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        // Link to the specific product in the Product model
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],

    // 4. Shipping address (embedded object)
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // 5. Payment details
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      // This object will be populated by data from Stripe/PayPal
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    // 6. Order summary
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // 7. Order status
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    // 8. Automatically add 'createdAt' and 'updatedAt'
    timestamps: true,
  }
);


// 9. Create and export the model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;