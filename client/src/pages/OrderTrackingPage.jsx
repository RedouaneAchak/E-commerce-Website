import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaBox, FaCheckCircle, FaTruck, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/OrderTrackingPage.css';

export default function OrderTrackingPage() {
  const { token } = useAuth(); // Get the auth token
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000/api/v1"; // replace with your API

  // Fetch real orders from backend
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Handle manual tracking
  const handleTrackOrder = (e) => {
    e.preventDefault();
    const order = orders.find(o => o.trackingNumber === trackingNumber);
    setSelectedOrder(order || null);
  };

  // Map status to icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'processing': return <FaBox />;
      case 'in-transit': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      default: return <FaBox />;
    }
  };

  // Map status to color
  const getStatusColor = (status) => {
    switch(status) {
      case 'processing': return '#ff9800';
      case 'in-transit': return '#2196f3';
      case 'delivered': return '#4caf50';
      default: return '#666';
    }
  };

  return (
    <div className="tracking-page">

      <div className="tracking-container">
        <div className="tracking-header">
          <h1>Track Your Order</h1>
          <p>Enter your tracking number to see order status</p>
        </div>

        {/* Tracking Search */}
        <div className="tracking-search">
          <form onSubmit={handleTrackOrder}>
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Enter tracking number (e.g., TRK1234567890)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <button type="submit" className="track-btn">Track Order</button>
            </div>
          </form>
        </div>

        {/* Tracked Order Details */}
        {selectedOrder && (
          <div className="order-details-card">
            <div className="order-header-info">
              <div className="order-id-section">
                <h2>Order #{selectedOrder.id}</h2>
                <span 
                  className="status-badge"
                  style={{ background: getStatusColor(selectedOrder.status) }}
                >
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.replace('-', ' ')}
                </span>
              </div>
              <div className="delivery-info">
                <p className="delivery-date">
                  {selectedOrder.status === 'delivered' 
                    ? `Delivered on ${selectedOrder.estimatedDelivery}`
                    : `Estimated Delivery: ${selectedOrder.estimatedDelivery}`
                  }
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="tracking-timeline">
              {selectedOrder.timeline.map((step, index) => (
                <div 
                  key={index} 
                  className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                >
                  <div className="timeline-marker">
                    {step.completed ? <FaCheckCircle /> : <div className="empty-circle"></div>}
                  </div>
                  <div className="timeline-content">
                    <h4>{step.status}</h4>
                    <p>{step.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="shipping-details">
              <div className="detail-section">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress}</p>
              </div>
              <div className="detail-section">
                <h4>Tracking Number</h4>
                <p className="tracking-num">{selectedOrder.trackingNumber}</p>
              </div>
              <div className="detail-section">
                <h4>Total Amount</h4>
                <p className="total-amount">${selectedOrder.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="recent-orders">
          <h2>Your Recent Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">{order.date}</p>
                    </div>
                    <span 
                      className="status-badge small"
                      style={{ background: getStatusColor(order.status) }}
                    >
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="order-card-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="mini-item">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                    <button 
                      className="view-details-btn"
                      onClick={() => {
                        setTrackingNumber(order.trackingNumber);
                        setSelectedOrder(order);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
