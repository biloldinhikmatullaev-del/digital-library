import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CreditCard, ShoppingBag, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: user ? user.email : "",
    fullName: user ? user.displayName : "",
    address: "",
    city: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const isCartEmpty = cartItems.length === 0;
  const shippingCost = cartTotal > 150 ? 0 : 15.0;
  const grandTotal = cartTotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCartEmpty) return;

    setLoading(true);
    setError("");

    try {
      // Call Netlify serverless function
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          customer: {
            email: formData.email,
            name: formData.fullName,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          },
          total: grandTotal
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderResult(data);
        // Save order in mock order history
        const mockOrders = JSON.parse(localStorage.getItem("lumina_mock_orders") || "[]");
        mockOrders.unshift({
          orderId: data.orderId,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          total: data.total,
          items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
          status: "Processing"
        });
        localStorage.setItem("lumina_mock_orders", JSON.stringify(mockOrders));

        clearCart();
      } else {
        throw new Error(data.error || "Something went wrong during checkout.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="checkout-page container success-view">
        <div className="success-card glass">
          <CheckCircle size={64} className="success-icon" />
          <h2 className="success-title">Thank you for your order!</h2>
          <p className="success-subtitle">Your payment was processed successfully.</p>
          
          <div className="order-receipt glass">
            <div className="receipt-row">
              <span>Order Number</span>
              <strong className="receipt-value">{orderResult.orderId}</strong>
            </div>
            <div className="receipt-row">
              <span>Total Paid</span>
              <strong>${orderResult.total.toFixed(2)}</strong>
            </div>
            <div className="receipt-row">
              <span>Estimated Delivery</span>
              <span>{orderResult.deliveryEstimate}</span>
            </div>
          </div>
          
          <p className="success-notice">We've sent a confirmation email to {formData.email}.</p>
          <Link to="/catalog" className="btn-primary success-btn">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="ambient-glow" style={{ top: "0", right: "20%" }}></div>

      <div className="checkout-header">
        <h1 className="checkout-title">Secure Checkout</h1>
        <p className="checkout-subtitle">Review your bag and complete your order details.</p>
      </div>

      {isCartEmpty ? (
        <div className="checkout-empty glass">
          <ShoppingBag size={48} className="empty-icon" />
          <h3>Your shopping bag is empty</h3>
          <p>You cannot checkout with an empty bag.</p>
          <Link to="/catalog" className="btn-primary">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Checkout Form */}
          <form className="checkout-form glass" onSubmit={handleSubmit}>
            {error && <div className="checkout-error">{error}</div>}

            {/* Step 1: Customer Contact */}
            <div className="form-section">
              <h3 className="form-section-title">1. Customer Information</h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-field"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="input-field"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="form-section">
              <h3 className="form-section-title">2. Shipping Address</h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="input-field"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Workspace Blvd"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="input-field"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Silicon Valley"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip/Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="input-field"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="94025"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Details */}
            <div className="form-section">
              <h3 className="form-section-title">
                <CreditCard size={18} /> 3. Payment Method
              </h3>
              <p className="payment-hint">This is a secure simulation. Enter any mock card values.</p>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    className="input-field"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="JOHN DOE"
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="input-field"
                    required
                    maxLength="19"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4111 2222 3333 4444"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiration (MM/YY)</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    className="input-field"
                    required
                    maxLength="5"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="12/28"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardCvv">CVV Code</label>
                  <input
                    type="password"
                    id="cardCvv"
                    name="cardCvv"
                    className="input-field"
                    required
                    maxLength="4"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="form-submit-row">
              <div className="secure-badge">
                <ShieldCheck size={16} />
                <span>256-bit SSL Encrypted Connection</span>
              </div>
              <button type="submit" className="btn-primary place-order-btn" disabled={loading}>
                {loading ? "Processing Secure Payment..." : `Pay $${grandTotal.toFixed(2)}`}
              </button>
            </div>
          </form>

          {/* Order Summary sidebar */}
          <aside className="checkout-summary-sidebar glass">
            <h3 className="sidebar-title">Order Summary</h3>

            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div className="checkout-item-row" key={item.id}>
                  <div className="checkout-item-thumbnail">
                    <img src={item.image} alt={item.name} />
                    <span className="checkout-item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item-info">
                    <h4>{item.name}</h4>
                    <p className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cost-totals-block">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="shipping-promo-hint">Add <strong>${(150 - cartTotal).toFixed(2)}</strong> more to get Free Shipping!</p>
              )}
              <div className="totals-row grand-total-row">
                <span>Total Due</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
