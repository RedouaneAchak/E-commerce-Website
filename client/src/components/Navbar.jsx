import '../styles/Navbar.css';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import logo from '../assets/RED-in.png';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <img src={logo} alt="Store Logo" />
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
          <div className="nav-icon">
            <FaUser />
            <span>Account</span>
          </div>

          {/* Shopping Cart */}
          <div className="nav-icon">
            <FaShoppingCart />
            <span className="cart-count">0</span>
            <span>Cart</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
