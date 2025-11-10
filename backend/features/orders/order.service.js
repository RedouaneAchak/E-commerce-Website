const Order = require('./order.model');
const Product = require('../products/product.model'); // We need this to update stock

// --- Service Function: Create a New Order ---
const createNewOrder = async (orderData) => {
  // 1. Create the new order in the database
  const newOrder = new Order(orderData);
  const createdOrder = await newOrder.save();

  // 2. After creating the order, update the stock for each product
  // This is a critical step!
  const stockUpdatePromises = createdOrder.orderItems.map(async (item) => {
    // Find the product
    const product = await Product.findById(item.product);

    if (product) {
      // Decrease the stock
      product.countInStock = product.countInStock - item.qty;
      // Save the updated product
      return product.save();
    } else {
      // This should ideally be handled with a "transaction"
      // to roll back the order, but for now, we'll log an error.
      console.error(`Product not found for stock update: ${item.product}`);
    }
  });

  // Wait for all stock updates to finish
  await Promise.all(stockUpdatePromises);

  // 3. Return the newly created order
  return createdOrder;
};

// --- Service Function: Find Orders by User ID ---
const findOrdersByUserId = async (userId) => {
  // Find all orders where the 'user' field matches the userId
  const orders = await Order.find({ user: userId });
  return orders;
};

// --- Service Function: Find a Single Order by ID ---
const findOrderById = async (orderId, user) => {
  // Find the order by its ID and also "populate" the 'user' field
  // with their 'name' and 'email' from the User collection.
  const order = await Order.findById(orderId).populate('user', 'name email');

  if (!order) {
    throw new Error('Order not found.');
  }

  // 2. Security Check:
  // Is the user an admin OR is this order's user the same as the logged-in user?
  if (user.isAdmin || order.user._id.toString() === user._id.toString()) {
    return order;
  } else {
    // If not, they are not authorized
    throw new Error('Not authorized to view this order.');
  }
};

// --- Service Function: Mark Order as Paid ---
const markOrderAsPaid = async (orderId, paymentResult) => {
  const order = await Order.findById(orderId);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentResult.id,
      status: paymentResult.status,
      update_time: paymentResult.update_time,
      email_address: paymentResult.email_address,
    };

    const updatedOrder = await order.save();
    return updatedOrder;
  } else {
    throw new Error('Order not found.');
  }
};

// --- Service Function: Find All Orders (Admin) ---
const findAllOrders = async () => {
  // Get all orders and populate the user's id and name
  const orders = await Order.find({}).populate('user', 'id name');
  return orders;
};

// --- Service Function: Mark Order as Delivered (Admin) ---
const markOrderAsDelivered = async (orderId) => {
  const order = await Order.findById(orderId);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    return updatedOrder;
  } else {
    throw new Error('Order not found.');
  }
};

// --- Export all functions ---
module.exports = {
  createNewOrder,
  findOrdersByUserId,
  findOrderById,
  markOrderAsPaid,
  findAllOrders,
  markOrderAsDelivered,
};