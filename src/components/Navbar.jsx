import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import "./Navbar.css";

export default function Navbar({ onCartToggle }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          Lumina
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/catalog" className="nav-link">Shop</Link>
          {user && (
            <Link to="/admin" className="nav-link nav-admin-link">
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
        </div>

        <div className="nav-actions">
          <button className="cart-trigger" onClick={onCartToggle} aria-label="Open cart">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="nav-user-menu">
              <Link to="/profile" className="nav-user-avatar" title="View Profile">
                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
              </Link>
              <button className="logout-btn" onClick={handleLogout} title="Log Out">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="login-link">
              <User size={20} /> Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass">
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/catalog" className="mobile-link" onClick={toggleMobileMenu}>Shop</Link>
          {user && (
            <Link to="/admin" className="mobile-link" onClick={toggleMobileMenu}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="mobile-link" onClick={toggleMobileMenu}>Profile</Link>
              <button className="mobile-link mobile-logout-btn" onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                <LogOut size={16} /> Log Out
              </button>
            </>
          ) : (
            <Link to="/auth" className="mobile-link" onClick={toggleMobileMenu}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
}
