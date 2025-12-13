const asyncHandler = require('express-async-handler');
const User = require('../auth/user.model'); // Import the User model

// @desc    Add product to favorites
// @route   POST /api/v1/users/favorites/:id
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  // $addToSet ensures we don't add the same product twice
  await User.findByIdAndUpdate(userId, {
    $addToSet: { favorites: productId }
  });

  res.status(200).json({ message: 'Product added to favorites' });
});

// @desc    Remove product from favorites
// @route   DELETE /api/v1/users/favorites/:id
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  // $pull removes the item from the array
  await User.findByIdAndUpdate(userId, {
    $pull: { favorites: productId }
  });

  res.status(200).json({ message: 'Product removed from favorites' });
});

// @desc    Get my favorites
// @route   GET /api/v1/users/favorites
// @access  Private
const getMyFavorites = asyncHandler(async (req, res) => {
  // Find the user and 'populate' (fetch details of) the favorite products
  const user = await User.findById(req.user._id).populate('favorites');
  
  if (user) {
    res.json(user.favorites);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { addFavorite, removeFavorite, getMyFavorites };