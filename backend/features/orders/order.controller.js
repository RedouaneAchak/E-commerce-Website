const asyncHandler = require('express-async-handler');
const orderService = require('./order.service'); // We'll create this next

// --- Create a New Order ---
// @route   POST /api/v1/orders
const createOrder = asyncHandler(async (req, res) => {
  // 1. Get the items from the request body
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  // 2. Basic validation
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items found.');
  }

  // 3. Get the user ID from the 'protect' middleware
  const userId = req.user._id;

  // 4. Create an orderData object to pass to the service
  const orderData = {
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  };

  // 5. Call the service to create the order
  const newOrder = await orderService.createNewOrder(orderData);

  res.status(201).json(newOrder); // 201 Created
});

// --- Get Logged-in User's Orders ---
// @route   GET /api/v1/orders/myorders
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await orderService.findOrdersByUserId(userId);
  res.status(200).json(orders);
});

// --- Get Order by ID ---
// @route   GET /api/v1/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const user = req.user; // Get the full user object

  const order = await orderService.findOrderById(orderId, user);
  res.status(200).json(order);
});

// --- Update Order to Paid ---
// @route   PUT /api/v1/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  // The 'paymentResult' will come from Stripe/PayPal
  const paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await orderService.markOrderAsPaid(orderId, paymentResult);
  res.status(200).json(updatedOrder);
});

// --- Get All Orders (Admin) ---
// @route   GET /api/v1/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.findAllOrders();
  res.status(200).json(orders);
});

// --- Update Order to Delivered (Admin) ---
// @route   PUT /api/v1/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = await orderService.markOrderAsDelivered(orderId);
  res.status(200).json(updatedOrder);
});

// --- Export all functions ---
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
};