const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../features/auth/user.model'); // Go up one level

// --- Middleware 1: Protect Routes (Check for valid token) ---
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      

      // 4. Find the user by the ID that was in the token
      //    We attach this user to the 'req' object so that
      //    all future routes/middleware can access req.user
      req.user = await User.findById(decoded.id).select('-password');
      
      // 5. If user not found (e.g., deleted), throw error
      if (!req.user) {
          res.status(401);
          throw new Error('User not found.');
      }

      // 6. Move on to the next function (e.g., the 'admin' middleware or the controller)
      next();

    } catch (error) {
      console.error(error);
      res.status(401); // 401 Unauthorized
      throw new Error('Not authorized, token failed.');
    }
  }

  // 7. If no token was found at all
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token.');
  }
});

// --- Middleware 2: Admin Check ---
// This middleware MUST run *after* the 'protect' middleware
const admin = (req, res, next) => {
  // 'req.user' was attached by the 'protect' middleware
  if (req.user && req.user.isAdmin) {
    // If user is an admin, move on
    next();
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized. Admin access only.');
  }
};

module.exports = { protect, admin };