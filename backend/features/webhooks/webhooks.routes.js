const express = 'express';
const router = express.Router();
const webhookController = require('./webhook.controller');

// @route   POST /api/v1/webhooks/stripe
// @desc    Listen for payment events from Stripe
// @access  Public (but secured by signature)
router.post('/stripe', webhookController.handleStripeWebhook);

module.exports = router;