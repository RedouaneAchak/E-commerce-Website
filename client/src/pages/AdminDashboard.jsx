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
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect non-admins and load data
  useEffect(() => {
    if (!user) return;

    if (!user.isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      await fetchProducts();
      await fetchOrders();
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Fetch all products
  const fetchProducts = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!token || !user?._id) {
      alert("User not authenticated.");
      return;
    }

    // Ensure numeric fields are numbers
    const productPayload = {
      ...newProduct,
      user: user._id,
      price: Number(newProduct.price),
      countInStock: Number(newProduct.countInStock),
    };

    try {
      const res = await fetch("http://localhost:5000/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add product");

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
      alert("Error adding product: " + err.message);
    }
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!token || !editingProduct) {
      alert("No product selected for editing.");
      return;
    }

    const productPayload = {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      brand: editingProduct.brand,
      category: editingProduct.category,
      countInStock: Number(editingProduct.countInStock),
      description: editingProduct.description,
      image: editingProduct.image,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productPayload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update product");

      setProducts(
        products.map((p) => (p._id === editingProduct._id ? data : p))
      );
      setEditingProduct(null);

      alert("Product updated!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product: " + err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p._id !== productId));
      alert("Product deleted!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product: " + err.message);
    }
  };

  // Start editing a product
  const startEditingProduct = (product) => {
    setEditingProduct({ ...product });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProduct(null);
  };

  // Mark order as delivered
  const handleDeliverOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/orders/${orderId}/deliver`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to mark order as delivered");

      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, isDelivered: true } : o
        )
      );
    } catch (err) {
      console.error("Error marking order delivered:", err);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

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
            {!editingProduct ? (
              <>
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
                      setNewProduct({
                        ...newProduct,
                        countInStock: e.target.value,
                      })
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
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                  <button type="submit">Add Product</button>
                </form>
              </>
            ) : (
              <>
                <h2>Edit Product</h2>
                <form className="add-product-form" onSubmit={handleUpdateProduct}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand"
                    value={editingProduct.brand}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        brand: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock Count"
                    value={editingProduct.countInStock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        countInStock: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        image: e.target.value,
                      })
                    }
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            <h2>Existing Products</h2>
            <div className="product-list">
              {products.map((p) => (
                <div key={p._id} className="product-card">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p>${p.price}</p>
                  <p>{p.brand}</p>
                  <p>{p.category}</p>
                  <p>Stock: {p.countInStock}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={() => startEditingProduct(p)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p._id)}>
                      Delete
                    </button>
                  </div>
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