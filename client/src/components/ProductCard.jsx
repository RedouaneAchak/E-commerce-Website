import '../styles/ProductCard.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.discount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < product.rating ? 'star-filled' : 'star-empty'}
            />
          ))}
          <span className="rating-count">({product.reviews})</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            {product.discount ? (
              <>
                <span className="price-original">${product.originalPrice}</span>
                <span className="price-current">${product.price}</span>
              </>
            ) : (
              <span className="price-current">${product.price}</span>
            )}
          </div>
          
          <button className="add-to-cart-btn">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}