import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginRegisterPage from './pages/login_registerPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/tracking" element={<OrderTrackingPage />} />
                <Route path="/login_register" element={<LoginRegisterPage />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;