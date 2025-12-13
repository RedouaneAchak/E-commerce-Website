import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { FaUser, FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';
import logo from '../assets/RED-in.png';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login_register");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Store Logo" />
        </Link>

        {/* Links depending on user role */}
        {user && (
          <div className="nav-links">
            {user.isAdmin ? (
              <>
                <Link to="/admin_welcome" className="nav-link">Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/" className="nav-link">Products</Link>
                <Link to="/favorites" className="nav-link">
                  <FaHeart className="nav-link-icon" />
                  Favorites
                </Link>
                <Link to="/tracking" className="nav-link">Track Order</Link>
              </>
            )}
          </div>
        )}

        {/* Search bar */}
        <div className="nav-search">
          <input type="text" placeholder="Search products..." className="search-input" />
          <button className="search-btn"><FaSearch /></button>
        </div>

        {/* Icons / Login-Logout */}
        <div className="nav-icons">
          {!user ? (
            <Link to="/login_register" className="nav-icon">Login</Link>
          ) : (
            <>
              <button className="nav-icon" onClick={handleLogout}>
                <FaUser /><span>Logout</span>
              </button>

              {!user.isAdmin && (
                <Link to="/checkout" className="nav-icon">
                  <FaShoppingCart />
                  <span className="cart-count">{cartCount}</span>
                  <span>Cart</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
