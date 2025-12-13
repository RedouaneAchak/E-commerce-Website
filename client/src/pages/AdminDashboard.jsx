// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingDeliveries: 0,
  });

  // Redirect non-admins
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/"); // redirect non-admins to home
    } else {
      fetchStats();
    }
  }, [user]);

  // Fetch products and orders stats
  const fetchStats = async () => {
    try {
      const resProducts = await fetch("http://localhost:5000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsData = await resProducts.json();

      const resOrders = await fetch("http://localhost:5000/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await resOrders.json();

      const pending = ordersData.filter(order => !order.isDelivered).length;

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        pendingDeliveries: pending,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <p className="admin-name">Hello, {user?.name}</p>
        <ul>
          <li onClick={() => navigate("/admin/products")}>Products</li>
          <li onClick={() => navigate("/admin/orders")}>Orders</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="welcome-card">
          <h1>Welcome, {user?.name}!</h1>
          <p>Manage products and orders from here.</p>
        </div>

        <div className="cards">
          <div className="card">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="card">
            <h3>Pending Deliveries</h3>
            <p>{stats.pendingDeliveries}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
