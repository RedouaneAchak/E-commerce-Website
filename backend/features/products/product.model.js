const mongoose = require('mongoose');

// 1. We'll create a separate schema for Reviews
// This is a "sub-document" schema.
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    // Each review is linked to a user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a relationship with the 'User' model
    },
  },
  {
    timestamps: true,
  }
);


// 2. Now, the main Product Schema
const productSchema = new mongoose.Schema(
  {
    // The user who created this product (an admin)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      // We'll store the path to the image, e.g., /images/sample.jpg
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // We will embed the reviews directly into the product document
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // 3. Automatically add 'createdAt' and 'updatedAt'
    timestamps: true,
  }
);

// 4. Create and export the model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;