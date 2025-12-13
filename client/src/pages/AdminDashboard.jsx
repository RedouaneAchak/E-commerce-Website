import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    countInStock: "",
    description: "",
    image: "",
  });

  // Redirect non-admins
  useEffect(() => {
    if (!user) return;
    if (!user.isAdmin) {
      navigate("/");
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newProduct, user: user.id }),
      });
      const data = await res.json();
      setProducts([...products, data]);
      setNewProduct({
        name: "",
        price: "",
        brand: "",
        category: "",
        countInStock: "",
        description: "",
        image: "",
      });
      alert("Product added!");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Mark order as delivered
  const handleDeliverOrder = async (orderId) => {
    try {
      await fetch(`http://localhost:5000/api/v1/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, isDelivered: true } : o
        )
      );
    } catch (err) {
      console.error("Error marking order delivered:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <p className="admin-name">Hello, {user?.name}</p>
        <ul>
          <li onClick={() => setActiveTab("products")}>Products</li>
          <li onClick={() => setActiveTab("orders")}>Orders</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="welcome-card">
          <h1>Welcome, {user?.name}!</h1>
          <p>Manage products and orders from here.</p>
        </div>

        {activeTab === "products" && (
          <div className="tab-content">
            <h2>Add New Product</h2>
            <form className="add-product-form" onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Brand"
                value={newProduct.brand}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Stock Count"
                value={newProduct.countInStock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, countInStock: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
              ></textarea>
              <button type="submit">Add Product</button>
            </form>

            <h2>Existing Products</h2>
            <div className="product-list">
              {products.map((p) => (
                <div key={p.id || p._id} className="product-card">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p>${p.price}</p>
                  <p>{p.brand}</p>
                  <p>{p.category}</p>
                  <p>Stock: {p.countInStock}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="tab-content">
            <h2>All Orders</h2>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <p>Order ID: {order._id}</p>
                  <p>Total: ${order.totalPrice}</p>
                  <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
                  <p>Delivered: {order.isDelivered ? "Yes" : "No"}</p>
                  {!order.isDelivered && (
                    <button onClick={() => handleDeliverOrder(order._id)}>
                      Mark as Delivered
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
