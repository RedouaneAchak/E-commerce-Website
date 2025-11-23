import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import '../styles/FavoritesPage.css';

// Mock favorites data
const mockFavorites = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    inStock: true
  },
  {
    id: 3,
    name: "Designer Leather Bag",
    category: "Fashion",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop",
    inStock: true
  },
  {
    id: 9,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    originalPrice: 169.99,
    discount: 24,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&h=500&fit=crop",
    inStock: false
  }
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const addToCart = (product) => {
    console.log('Added to cart:', product);
    // Add to cart logic here
  };

  return (
    <div className="favorites-page">
      
      <div className="favorites-container">
        <div className="favorites-header">
          <div className="header-content">
            <FaHeart className="header-icon" />
            <div>
              <h1>My Favorites</h1>
              <p>{favorites.length} items saved</p>
            </div>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item.id} className="favorite-card">
                <button 
                  className="remove-btn"
                  onClick={() => removeFromFavorites(item.id)}
                  aria-label="Remove from favorites"
                >
                  <FaTrash />
                </button>

                {item.discount && (
                  <span className="discount-badge">-{item.discount}%</span>
                )}

                {!item.inStock && (
                  <span className="stock-badge">Out of Stock</span>
                )}

                <div className="favorite-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="favorite-info">
                  <span className="favorite-category">{item.category}</span>
                  <h3 className="favorite-name">{item.name}</h3>
                  
                  <div className="favorite-footer">
                    <div className="favorite-price">
                      {item.discount && (
                        <span className="price-original">${item.originalPrice}</span>
                      )}
                      <span className="price-current">${item.price}</span>
                    </div>

                    <button 
                      className={`add-cart-btn ${!item.inStock ? 'disabled' : ''}`}
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                    >
                      <FaShoppingCart />
                      <span>{item.inStock ? 'Add to Cart' : 'Unavailable'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <FaHeart className="empty-icon" />
            <h2>Your favorites list is empty</h2>
            <p>Start adding products you love to keep track of them</p>
            <a href="/products" className="browse-btn">Browse Products</a>
          </div>
        )}
      </div>

    </div>
  );
}