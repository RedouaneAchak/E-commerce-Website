import { useState, useEffect } from 'react';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5000/  /v1";

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = 10;
  const total = subtotal + tax + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return alert("Your cart is empty!");
    if (!token) {
      alert("You must be logged in to checkout");
      return navigate("/login_register");
    }

    setLoading(true);

    try {
      // 1️⃣ Create order
      const orderBody = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: "Stripe",
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };

      const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderBody)
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      const orderId = orderData._id;

      // 2️⃣ Stripe checkout
      const paymentRes = await fetch(`${BASE_URL}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems: cart.map(item => ({ product: item.id, qty: item.quantity })),
          orderId
        })
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.message || "Failed to initiate payment session");

      // 3️⃣ Redirect to Stripe
      window.location.href = paymentData.url;

    } catch (err) {
      alert("Checkout Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="secure-badge">
            <FaLock />
            <span>Secure Checkout</span>
          </div>
        </div>

        <div className="checkout-content">

          {/* LEFT SIDE */}
          <div className="checkout-forms">
            <form onSubmit={handleSubmit}>
              
              {/* CONTACT */}
              <div className="form-section">
                <h2>Contact Information</h2>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* SHIPPING */}
              <div className="form-section">
                <h2>Shipping Address</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input 
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>

              {/* PAYMENT INFO */}
              <div className="form-section">
                <h2><FaCreditCard /> Payment Information</h2>
                <p style={{ color: "#555", fontSize: "14px" }}>
                  You will enter your card securely on Stripe after pressing "Place Order".
                </p>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                <FaCheckCircle />
                <span>{loading ? "Processing..." : `Proceed to Payment – $${total.toFixed(2)}`}</span>
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-calculations">
              <div className="calc-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="calc-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="calc-row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="trust-badges">
              <div className="badge"><FaLock /><span>Secure Payment</span></div>
              <div className="badge"><FaCheckCircle /><span>Guaranteed Protection</span></div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
