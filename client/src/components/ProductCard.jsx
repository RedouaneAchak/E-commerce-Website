import '../styles/ProductCard.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
  return (
    <div className="el-wrapper">
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
                className={i < product.rating ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span className="rating-count">({product.reviews})</span>
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
          <button className="add-to-cart">
            <FaShoppingCart className="cart-icon" />
            <span className="txt">Add in cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}