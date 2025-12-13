// src/pages/ProductPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import '../styles/ProductPage.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    staleTime: 5 * 60 * 1000,
  });

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  if (isLoading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">Error loading product: {error.message}</div>;

  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="product-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-meta">
            <span className="product-category">{product.category}</span>
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
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FaShoppingCart className="cart-icon" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
