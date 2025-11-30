import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { FaUser, FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';
import logo from '../assets/RED-in.png';
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Store Logo" />
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Products</Link>
          <Link to="/favorites" className="nav-link">
            <FaHeart className="nav-link-icon" />
            Favorites
          </Link>
          <Link to="/tracking" className="nav-link">Track Order</Link>
        </div>

        {/* Search Bar */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>

        {/* Right Side Icons */}
        <div className="nav-icons">
          {/* User Account */}
          <Link to="/account" className="nav-icon">
            <FaUser />
            <span>Account</span>
          </Link>

          {/* Shopping Cart */}
          <Link to="/checkout" className="nav-icon">
            <FaShoppingCart />
            <span className="cart-count">{cartCount}</span>
            <span>Cart</span>
          </Link>
          <Link to="/login_register" className="nav-icon">
            <span>Login/Register</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}