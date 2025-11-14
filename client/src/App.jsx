import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/tracking" element={<OrderTrackingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;