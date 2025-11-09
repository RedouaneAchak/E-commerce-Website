const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const { protect, admin } = require('../../middleware/auth.middleware');

// --- User Routes ---

// @route   POST /api/v1/orders
// @desc    Create a new order
// @access  Private (Only logged-in users)
router.post('/', protect, orderController.createOrder);

// @route   GET /api/v1/orders/myorders
// @desc    Get all orders for the logged-in user
// @access  Private
router.get('/myorders', protect, orderController.getUserOrders);

// @route   GET /api/v1/orders/:id
// @desc    Get a single order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrderById);

// @route   PUT /api/v1/orders/:id/pay
// @desc    Update an order to "paid" (we'll use this for Stripe)
// @access  Private
router.put('/:id/pay', protect, orderController.updateOrderToPaid);

// --- Admin Routes ---

// @route   GET /api/v1/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, orderController.getAllOrders);

// @route   PUT /api/v1/orders/:id/deliver
// @desc    Update an order to "delivered" (Admin only)
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, orderController.updateOrderToDelivered);

module.exports = router;