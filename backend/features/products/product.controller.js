const asyncHandler = require('express-async-handler');
const productService = require('./product.service'); // We'll create this next

// --- Get All Products ---
// @route   GET /api/v1/products
const getAllProducts = asyncHandler(async (req, res) => {
  // We'll call the service to get the products
  const products = await productService.fetchAllProducts();

  res.status(200).json(products);
});

// --- Get Single Product by ID ---
// @route   GET /api/v1/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await productService.fetchProductById(productId);

  // The service will throw an error if not found,
  // which asyncHandler will catch.
  res.status(200).json(product);
});

// --- Create a New Product (Admin) ---
// @route   POST /api/v1/products
const createProduct = asyncHandler(async (req, res) => {
  // For a real app, you'd validate req.body data here
  // We'll just pass the whole body to the service for now
  const productData = req.body;

  const newProduct = await productService.addNewProduct(productData);

  res.status(201).json(newProduct); // 201 Created
});

// --- Update a Product (Admin) ---
// @route   PUT /api/v1/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  const updatedProduct = await productService.updateExistingProduct(
    productId,
    productData
  );

  res.status(200).json(updatedProduct);
});

// --- Delete a Product (Admin) ---
// @route   DELETE /api/v1/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  
  await productService.removeProduct(productId);

  res.status(200).json({ message: 'Product removed successfully.' });
});

// --- Export all the functions ---
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};