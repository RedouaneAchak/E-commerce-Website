import '../styles/ProductCard.css';
import { FaShoppingCart, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user, token } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);

  // Check if product is in user's favorites on mount
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIsFavorite(data.some(fav => fav._id === product._id));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [user, token, product._id]);

  // Add/remove from favorites
  const toggleFavorite = async (e) => {
    e.preventDefault(); // prevent Link navigation
    if (!user) {
      alert("You must be logged in to add favorites");
      return;
    }

    try {
      const url = `http://localhost:5000/api/v1/users/favorites/${product._id}`;
      const method = isFavorite ? "DELETE" : "POST";

      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation when clicking the cart button
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  return (
    <Link to={`/product/${product._id}`} className="el-wrapper">
      <div className="box-up">
        <img className="img" src={product.image} alt={product.name} />

        {product.discount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}

        <div className="img-info">
          <div className="info-inner">
            <span className="p-name">{product.name}</span>
            <span className="p-company">{product.category}</span>
          </div>

          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < (product.rating || 0) ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span className="rating-count">({product.reviews || 0})</span>
          </div>
        </div>

       
      </div>

      <div className="box-down">
        <div className="h-bg">
          <div className="h-bg-inner"></div>
        </div>

        <div className="cart">
          <div className="product-price">
            {product.discount ? (
              <>
                <span className="price-original">${product.originalPrice}</span>
                <span className="price">${product.price}</span>
              </>
            ) : (
              <span className="price">${product.price}</span>
            )}
          </div>

          <div className="cart-actions">
            {/* ADD TO CART BUTTON */}
            <button className="add-to-cart" onClick={handleAddToCart}>
              <FaShoppingCart className="cart-icon" />
              <span className="txt">Add to Cart</span>
            </button>

            {/* FAVORITE HEART */}
            <button className="favorite-btn" onClick={toggleFavorite}>
              {isFavorite ? <FaHeart className="heart-icon filled" /> : <FaRegHeart className="heart-icon" />}
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
