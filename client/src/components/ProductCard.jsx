import '../styles/ProductCard.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,      // IMPORTANT: backend product ID
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

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

          {/* Product rating */}
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
          {/* Price display */}
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

          {/* ADD TO CART BUTTON */}
          <button className="add-to-cart" onClick={handleAddToCart}>
            <FaShoppingCart className="cart-icon" />
            <span className="txt">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
