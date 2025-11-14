const jwt = require('jsonwebtoken');
const User = require('./user.model');

// --- Helper Function: Generate JWT ---
// This isn't exported; it's just for this file to use.
const generateToken = (userId) => {
  // 1. Get the secret and expiration from .env
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env file');
  }

  // 2. 'Sign' the token
  return jwt.sign(
    { id: userId }, // The 'payload' - what we want to store
    secret, // The 'secret' - only the server knows this
    { expiresIn: expiresIn } // e.g., '30d' for 30 days
  );
};


// --- Service Function: Register User ---
const register = async (name, email, password) => {
  // 1. Check if user (email) already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // We'll throw an error, which our asyncHandler will catch
    throw new Error('User with this email already exists.');
  }

  // 2. Create the new user in the database
  // The 'pre-save' hook in user.model.js will automatically hash the password
  const user = await User.create({
    name,
    email,
    password, // Send the plain text, the model handles hashing
  });

  // 3. If user was created successfully...
  if (user) {
    // 4. Generate a token
    const token = generateToken(user._id);

    // 5. Return the new user and token to the controller
    return { user, token };
  } else {
    // This is a fallback, in case creation fails
    throw new Error('Invalid user data. Registration failed.');
  }
};

// --- Service Function: Login User ---
const login = async (email, password) => {
  // 1. Find the user by their email
  // We MUST use .select('+password') because it's hidden by default
  const user = await User.findOne({ email }).select('+password');
  

  // 2. Check if user exists AND if the password matches
  // We use the custom 'matchPassword' method we created in the model
  if (user && (await user.matchPassword(password))) {
    // 3. If they match, generate a token
    const token = generateToken(user._id);

    // 4. Return the user and token to the controller
    return { user, token };
  } else {
    // 5. If user not found OR password mismatch...
    // Throw a generic error. (Security: Don't tell the attacker
    // if it was the email or password that was wrong.)
    throw new Error('Invalid email or password.');
  }
};

// --- Export the public functions ---
module.exports = {
  register,
  login,
};