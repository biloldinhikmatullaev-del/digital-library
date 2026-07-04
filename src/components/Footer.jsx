import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Lumina</Link>
          <p className="footer-desc">
            Premium gadgets & ambient desk electronics. Elevate your workspace experience with curated tech and sleek minimal aesthetics.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-links">
            <h4 className="footer-title">Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/catalog">Shop All</Link>
            <Link to="/profile">My Account</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Categories</h4>
            <Link to="/catalog?category=audio">Audio</Link>
            <Link to="/catalog?category=displays">Displays</Link>
            <Link to="/catalog?category=peripherals">Peripherals</Link>
            <Link to="/catalog?category=lighting">Lighting</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Newsletter</h4>
            <p className="newsletter-text">Subscribe to receive launch updates and exclusive discounts.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="input-field" required />
              <button type="submit" className="btn-primary">Join</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>&copy; {new Date().getFullYear()} Lumina. All rights reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
