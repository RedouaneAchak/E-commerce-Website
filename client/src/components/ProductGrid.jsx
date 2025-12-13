import '../styles/ProductGrid.css';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <div className="no-products">
          <p>No products found in this category</p>
        </div>
      )}
    </div>
  );
}
