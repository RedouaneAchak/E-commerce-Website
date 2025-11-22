const API_BASE_URL = 'http://localhost:5000/api/v1';

export const productService = {
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  }
};