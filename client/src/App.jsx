import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginRegisterPage from './pages/login_registerPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProductPage from './pages/ProductPage';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login_register" />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login_register" element={<LoginRegisterPage />} />

                <Route path="/" element={
                  <PrivateRoute><ProductsPage /></PrivateRoute>
                } />

                <Route path="/favorites" element={
                  <PrivateRoute><FavoritesPage /></PrivateRoute>
                } />

                <Route path="/checkout" element={
                  <PrivateRoute><CheckoutPage /></PrivateRoute>
                } />

                <Route path="/tracking" element={
                  <PrivateRoute><OrderTrackingPage /></PrivateRoute>
                } />
                <Route path="/product/:id" element={
                  <PrivateRoute><ProductPage /></PrivateRoute>
                } />

              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
