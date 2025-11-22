// ProductsPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { productService } from '../services/productService';
import '../styles/ProductsPage.css';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const categories = ['All', 'Electronics', 'Fashion', 'Food', 'Sports', 'Home'];
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  if (isLoading) {
    return (
      <div className="products-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error">Error loading products: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="products-container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p className="products-count">
            Showing {filteredProducts.length} {activeCategory !== 'All' ? activeCategory : ''} products
          </p>
        </div>
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}