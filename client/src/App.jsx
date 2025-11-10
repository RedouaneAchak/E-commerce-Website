import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.css'

import './App.css';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;