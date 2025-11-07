const Product = require('./product.model');

// --- Service Function: Get All Products ---
const fetchAllProducts = async () => {
  // .find({}) with an empty object means "find all"
  const products = await Product.find({});
  return products;
};

// --- Service Function: Get Product by ID ---
const fetchProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (product) {
    return product;
  } else {
    // If no product is found, throw an error.
    // This will be caught by our 'asyncHandler' in the controller.
    throw new Error('Product not found.');
  }
};

// --- Service Function: Create a New Product ---
const addNewProduct = async (productData) => {
  // In a real app, you'd add the 'user' ID from the logged-in admin
  // const product = new Product({
  //   ...productData,
  //   user: loggedInUserId, 
  // });
  // await product.save();
  
  // For now, we'll create a simple product
  const product = await Product.create(productData);
  return product;
};

// --- Service Function: Update an Existing Product ---
const updateExistingProduct = async (productId, productData) => {
  // Find the product by its ID and update it with the new data
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      new: true, // This option returns the *updated* document
      runValidators: true, // This runs your schema validators
    }
  );

  if (updatedProduct) {
    return updatedProduct;
  } else {
    throw new Error('Product not found. Update failed.');
  }
};

// --- Service Function: Delete a Product ---
const removeProduct = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (deletedProduct) {
    // We don't need to return anything, just confirm it worked
    return;
  } else {
    throw new Error('Product not found. Delete failed.');
  }
};

// --- Export all the service functions ---
module.exports = {
  fetchAllProducts,
  fetchProductById,
  addNewProduct,
  updateExistingProduct,
  removeProduct,
};