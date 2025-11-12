import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaBox, FaCheckCircle, FaTruck, FaHome, FaSearch } from 'react-icons/fa';
import '../styles/OrderTrackingPage.css';

// Mock orders data
const mockOrders = [
  {
    id: "ORD-2024-001234",
    date: "2024-11-10",
    status: "in-transit",
    estimatedDelivery: "2024-11-15",
    items: [
      {
        name: "Premium Wireless Headphones",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
      }
    ],
    total: 79.99,
    shippingAddress: "123 Main Street, New York, NY 10001",
    trackingNumber: "TRK1234567890",
    timeline: [
      { status: "Order Placed", date: "Nov 10, 2024 - 10:30 AM", completed: true },
      { status: "Processing", date: "Nov 10, 2024 - 2:15 PM", completed: true },
      { status: "Shipped", date: "Nov 11, 2024 - 9:00 AM", completed: true },
      { status: "In Transit", date: "Nov 12, 2024 - 3:45 PM", completed: true, current: true },
      { status: "Out for Delivery", date: "Expected Nov 15, 2024", completed: false },
      { status: "Delivered", date: "Expected Nov 15, 2024", completed: false }
    ]
  },
  {
    id: "ORD-2024-001189",
    date: "2024-11-05",
    status: "delivered",
    estimatedDelivery: "2024-11-08",
    items: [
      {
        name: "Designer Leather Bag",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop"
      }
    ],
    total: 299.98,
    shippingAddress: "123 Main Street, New York, NY 10001",
    trackingNumber: "TRK0987654321",
    timeline: [
      { status: "Order Placed", date: "Nov 5, 2024 - 11:20 AM", completed: true },
      { status: "Processing", date: "Nov 5, 2024 - 4:30 PM", completed: true },
      { status: "Shipped", date: "Nov 6, 2024 - 8:15 AM", completed: true },
      { status: "In Transit", date: "Nov 7, 2024 - 1:20 PM", completed: true },
      { status: "Out for Delivery", date: "Nov 8, 2024 - 7:00 AM", completed: true },
      { status: "Delivered", date: "Nov 8, 2024 - 2:45 PM", completed: true, current: true }
    ]
  }
];

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    const order = mockOrders.find(o => o.trackingNumber === trackingNumber);
    setSelectedOrder(order || null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'processing': return <FaBox />;
      case 'in-transit': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      default: return <FaBox />;
    }
  };

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
          <div className="orders-grid">
            {mockOrders.map((order) => (
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
        </div>
      </div>

      <Footer />
    </div>
  );
}