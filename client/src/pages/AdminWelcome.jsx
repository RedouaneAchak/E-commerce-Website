// src/pages/AdminWelcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminWelcome.css";
import { useAuth } from "../context/AuthContext";

export default function AdminWelcome() {

      const { logout } = useAuth();
      const navigate = useNavigate();
    
      const handleLogout = () => {
        logout();
        navigate("/login_register");
      };


    return (
        <div className="admin-welcome">
            <div className="admin-card">
                <h1>Welcome, Admin!</h1>
                <p>Manage your dashboard and users from here.</p>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
