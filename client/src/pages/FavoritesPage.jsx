import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/FavoritesPage.css';

export default function FavoritesPage() {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's favorites from backend
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  const removeFromFavorites = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/users/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      setFavorites(favorites.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const addToCart = (product) => {
    console.log('Added to cart:', product);
    // Add to cart logic here
  };

  if (loading) {
    return <div className="favorites-page"><p>Loading favorites...</p></div>;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <div className="header-content">
            <FaHeart className="header-icon" />
            <div>
              <h1>My Favorites</h1>
              <p>{favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved</p>
            </div>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item._id} className="favorite-card">
                <button 
                  className="remove-btn"
                  onClick={() => removeFromFavorites(item._id)}
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
            <button 
              className="browse-btn"
              onClick={() => navigate("/")}
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
