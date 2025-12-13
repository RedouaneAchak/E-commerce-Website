const express = require('express');
const router = express.Router();

// 1. **FIXED**: Use CommonJS 'require' for the middleware
const { protect } = require('../../middleware/auth.middleware'); 

// 2. Import the controller functions
const authController = require('./auth.controller');

// 3. Define the authentication routes
// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST /api/v1/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET /api/v1/auth/me
// @desc    Get current user profile (Requires authentication)
// @access  Private
router.get("/me", protect, (req, res) => {
    // FIX APPLIED HERE: Wrap the user in a 'user' property
    res.json({ user: req.user });
});

// 4. Export the router
module.exports = router;