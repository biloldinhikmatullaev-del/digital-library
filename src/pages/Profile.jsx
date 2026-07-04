import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Package, ExternalLink, Calendar, CheckCircle } from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const { user, logout, isMock } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("lumina_mock_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Error loading orders history", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (!user) {
    return (
      <div className="profile-page container guest-view glass">
        <User size={48} className="guest-icon" />
        <h2>Access Denied</h2>
        <p>Please log in to view your profile and order history.</p>
        <Link to="/auth" className="btn-primary">
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page container">
      <div className="ambient-glow" style={{ bottom: "-10%", left: "10%" }}></div>

      <div className="profile-grid">
        {/* User Card */}
        <aside className="profile-sidebar glass">
          <div className="avatar-large">
            {user.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>
          <h2 className="profile-name">{user.displayName || "Lumina Member"}</h2>
          <p className="profile-email">{user.email}</p>
          
          <div className="profile-badge-row">
            <span className="badge-category">
              {isMock ? "Mock Account" : "Firebase Account"}
            </span>
          </div>

          <button className="btn-secondary logout-profile-btn" onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </aside>

        {/* Orders History */}
        <main className="profile-main glass">
          <h3 className="section-title-profile">
            <Package size={20} /> Order History
          </h3>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <p>You haven't placed any orders yet.</p>
              <Link to="/catalog" className="btn-primary">
                Shop Our Collection
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, i) => (
                <div key={i} className="order-history-card glass">
                  <div className="order-history-header">
                    <div className="order-id-block">
                      <span className="order-id-label">Order Number</span>
                      <strong className="order-id-value">{order.orderId}</strong>
                    </div>
                    <span className="order-status-badge">
                      <CheckCircle size={12} /> {order.status}
                    </span>
                  </div>

                  <div className="order-meta-info">
                    <span className="order-meta-item">
                      <Calendar size={14} /> {order.date}
                    </span>
                    <span className="order-meta-item total-item">
                      Total: <strong>${order.total.toFixed(2)}</strong>
                    </span>
                  </div>

                  <div className="order-items-summary">
                    <label>Items Purchased</label>
                    <ul className="order-items-ul">
                      {order.items.map((item, index) => (
                        <li key={index} className="order-item-li">
                          <span>{item.name}</span>
                          <span className="item-qty-x">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
