const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getMyFavorites } = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');

// All these routes are protected (you must be logged in)
router.post('/favorites/:id', protect, addFavorite);
router.delete('/favorites/:id', protect, removeFavorite);
router.get('/favorites', protect, getMyFavorites);

module.exports = router;