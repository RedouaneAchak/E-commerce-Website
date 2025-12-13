// We'll use this to wrap our async functions and automatically catch errors
const asyncHandler = require('express-async-handler');
const authService = require('./auth.service'); // We'll create this next

// --- Register a New User ---
// @route   POST /api/v1/auth/register
const registerUser = asyncHandler(async (req, res) => {
  // 1. Get the data from the request body
  const { name, email, password } = req.body;

  // 2. Simple Validation: Check if fields are missing
  if (!name || !email || !password) {
    res.status(400); // 400 Bad Request
    throw new Error('Please provide all required fields: name, email, and password.');
  }

  // 3. Call the service to do the hard work
  // The service will handle creating the user, hashing the password, etc.
  const { user, token } = await authService.register(name, email, password);

  // 4. Send the response
  res.status(201).json({ // 201 Created
    message: 'User registered successfully.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token, // The JWT token
  });
});

// --- Log In an Existing User ---
// @route   POST /api/v1/auth/login
const loginUser = asyncHandler(async (req, res) => {
  // 1. Get data from request body
  const { email, password } = req.body;

  // 2. Simple Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password.');
  }

  // 3. Call the service to do the hard work
  // The service will find the user, compare the password, and create a token
  const { user, token } = await authService.login(email, password);

  // 4. Send the response
  res.status(200).json({ // 200 OK
    message: 'User logged in successfully.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token, // The JWT token
  });
});

// 5. Export the functions so the routes file can use them
module.exports = {
  registerUser,
  loginUser,
};