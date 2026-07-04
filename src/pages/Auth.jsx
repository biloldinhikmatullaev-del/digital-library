import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Sparkles } from "lucide-react";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup, isMock } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (loginTab) => {
    setIsLogin(loginTab);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password, confirmPassword } = formData;

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate("/profile");
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Failed to authenticate. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="ambient-glow" style={{ top: "10%", left: "30%" }}></div>

      <div className="auth-card glass">
        <div className="auth-logo-row">
          <span className="auth-brand">Lumina</span>
          <span className="badge-category">
            <Sparkles size={12} /> {isMock ? "Mock Mode" : "Firebase Secure"}
          </span>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => handleTabChange(true)}
          >
            Log In
          </button>
          <button
            className={`auth-tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => handleTabChange(false)}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="auth-error">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-field"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : isLogin ? "Log In" : "Register"}
          </button>
        </form>

        {isMock && (
          <p className="mock-credentials-hint">
            💡 <strong>Mock Mode:</strong> Enter any email and password to log in instantly.
          </p>
        )}
      </div>
    </div>
  );
}
