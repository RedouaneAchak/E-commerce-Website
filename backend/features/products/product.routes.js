const express = require('express');
const router = express.Router();

// 1. We'll import the controller
const productController = require('./product.controller');

// 2. We'll also need our auth middleware later to protect routes
const { protect, admin } = require('../../middleware/auth.middleware');

// --- Public Routes ---

// @route   GET /api/v1/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/v1/products/:id
// @desc    Get a single product by its ID
// @access  Public
router.get('/:id', productController.getProductById);

// --- Admin-Only Routes ---

// @route   POST /api/v1/products
// @desc    Create a new product
// @access  Private/Admin
// We'll add 'protect' and 'admin' middleware here later
router.post('/', protect, admin, productController.createProduct);

// @route   PUT /api/v1/products/:id
// @desc    Update a product
// @access  Private/Admin
// We'll add 'protect' and 'admin' middleware here later
router.put('/:id', protect, admin, productController.updateProduct);

// @route   DELETE /api/v1/products/:id
// @desc    Delete a product
// @access  Private/Admin
// We'll add 'protect' and 'admin' middleware here later
router.delete('/:id', protect, admin, productController.deleteProduct);

// 3. Export the router
module.exports = router;