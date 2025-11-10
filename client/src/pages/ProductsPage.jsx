import { useState } from 'react';
import Navbar from '../components/Navbar';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import '../styles/ProductsPage.css';


const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 234
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    category: "Electronics",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 187
  },
  {
    id: 3,
    name: "Designer Leather Bag",
    category: "Fashion",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 312
  },
  {
    id: 4,
    name: "Running Shoes",
    category: "Fashion",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 156
  },
  {
    id: 5,
    name: "Organic Coffee Beans",
    category: "Food",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 89
  },
  {
    id: 6,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 143
  },
  {
    id: 7,
    name: "Camping Tent 4-Person",
    category: "Sports",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 98
  },
  {
    id: 8,
    name: "Minimalist Desk Lamp",
    category: "Home",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 76
  },
  {
    id: 9,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    originalPrice: 169.99,
    discount: 24,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 267
  },
  {
    id: 10,
    name: "Luxury Candle Set",
    category: "Home",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1602874801006-22ad7398df6e?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 124
  },
  {
    id: 11,
    name: "Denim Jacket",
    category: "Fashion",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    rating: 4,
    reviews: 91
  },
  {
    id: 12,
    name: "Protein Powder",
    category: "Food",
    price: 49.99,
    originalPrice: 64.99,
    discount: 23,
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&h=500&fit=crop",
    rating: 5,
    reviews: 203
  }
];

// TODO : Replace mockProducts with API call
const getProducts = async () => {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Electronics', 'Fashion', 'Food', 'Sports', 'Home'];
  
  const filteredProducts = activeCategory === 'All' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === activeCategory);

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