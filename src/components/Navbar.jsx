import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, LayoutDashboard, Menu, X, Palette, ShoppingCart } from "lucide-react";
import "./Navbar.css";

export default function Navbar({ onCartToggle }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("lumina_theme") || "teal";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("lumina_theme", currentTheme);
  }, [currentTheme]);

  const cycleTheme = () => {
    const themes = ["teal", "gold", "indigo", "emerald"];
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    setCurrentTheme(themes[nextIdx]);
  };

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
          Lumina Lib
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/catalog" className="nav-link">Каталог</Link>
          <Link to="/profile" className="nav-link">Личный кабинет</Link>
          {user && (
            <Link to="/admin" className="nav-link nav-admin-link">
              <LayoutDashboard size={16} /> Админ-панель
            </Link>
          )}
        </div>

        <div className="nav-actions">
          {/* Theme Switcher Button */}
          <div className="theme-picker-container">
            <button 
              className="theme-dot" 
              onClick={cycleTheme} 
              title="Сменить тему оформления"
              aria-label="Сменить тему оформления"
            >
              <Palette size={18} />
            </button>
          </div>

          <button className="cart-trigger" onClick={onCartToggle} aria-label="Открыть корзину" title="Корзина">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="nav-user-menu">
              <Link to="/profile" className="nav-user-avatar" title="Личный кабинет">
                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
              </Link>
              <button className="logout-btn" onClick={handleLogout} title="Выйти">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="login-link">
              <User size={20} /> Войти
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass">
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>Главная</Link>
          <Link to="/catalog" className="mobile-link" onClick={toggleMobileMenu}>Каталог</Link>
          {user && (
            <Link to="/admin" className="mobile-link" onClick={toggleMobileMenu}>
              Админ-панель
            </Link>
          )}
          
          {/* Theme Option in Mobile Drawer */}
          <button 
            className="mobile-link" 
            onClick={() => { cycleTheme(); toggleMobileMenu(); }} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', width: '100%', gap: '8px', cursor: 'pointer' }}
          >
            <Palette size={16} /> Сменить цвет темы
          </button>

          {user ? (
            <>
              <Link to="/profile" className="mobile-link" onClick={toggleMobileMenu}>Личный кабинет</Link>
              <button className="mobile-link mobile-logout-btn" onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                <LogOut size={16} /> Выйти
              </button>
            </>
          ) : (
            <Link to="/auth" className="mobile-link" onClick={toggleMobileMenu}>Войти</Link>
          )}
        </div>
      )}
    </nav>
  );
}
