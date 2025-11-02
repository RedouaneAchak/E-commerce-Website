const express = require('express');
const router = express.Router();

// 1. We will import the controller functions we're about to create
const authController = require('./auth.controller');

// 2. Define the authentication routes
// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST /api/v1/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', authController.loginUser);

// 3. Export the router
module.exports = router;