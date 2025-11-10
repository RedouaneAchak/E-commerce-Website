const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { protect } = require('../../middleware/auth.middleware');

// @route   POST /api/v1/payment/create-checkout-session
// @desc    Create a new Stripe checkout session
// @access  Private (Only logged-in users)
router.post(
  '/create-checkout-session',
  protect, // Only logged-in users can pay
  paymentController.createCheckoutSession
);

module.exports = router;