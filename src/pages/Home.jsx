import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Sparkles, Volume2, Monitor, Keyboard, Lightbulb } from "lucide-react";
import "./Home.css";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from Netlify serverless function
    // If it fails or is offline, it will fall back to local mock data
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        if (res.ok) {
          const data = await res.json();
          // Take first 3 products as featured
          setFeaturedProducts(data.slice(0, 3));
        } else {
          throw new Error("API responded with error");
        }
      } catch (err) {
        console.warn("Failed to fetch via API, loading mock data...", err);
        // Fallback mock data
        const mockData = [
          {
            id: "p1",
            name: "Aura SoundLink Headphones",
            price: 349.99,
            category: "audio",
            rating: 4.8,
            image: "/images/headphones.png",
            description: "Premium active noise-cancelling wireless headphones with audiophile-grade sound resolution and a seamless matte finish.",
            stock: 12
          },
          {
            id: "p2",
            name: "Apex Mechanical Keyboard",
            price: 189.99,
            category: "peripherals",
            rating: 4.9,
            image: "/images/keyboard.png",
            description: "Compact 75% mechanical keyboard featuring custom linear silent switches, hot-swappable sockets, and dynamic RGB backlighting.",
            stock: 8
          },
          {
            id: "p3",
            name: "Horizon Curved OLED Monitor",
            price: 899.99,
            category: "displays",
            rating: 4.7,
            image: "/images/monitor.png",
            description: "34-inch ultrawide curved OLED gaming monitor delivering breathtaking colors, deep blacks, and a lightning-fast 240Hz refresh rate.",
            stock: 5
          }
        ];
        setFeaturedProducts(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: "Audio", icon: <Volume2 size={24} />, slug: "audio", color: "var(--accent-primary)" },
    { name: "Displays", icon: <Monitor size={24} />, slug: "displays", color: "var(--accent-secondary)" },
    { name: "Peripherals", icon: <Keyboard size={24} />, slug: "peripherals", color: "#38bdf8" },
    { name: "Lighting", icon: <Lightbulb size={24} />, slug: "lighting", color: "#facc15" }
  ];

  return (
    <div className="home-page">
      <div className="ambient-glow" style={{ top: "-100px", right: "-100px" }}></div>
      <div className="ambient-glow-2" style={{ top: "300px", left: "-200px" }}></div>

      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Futuristic workspace gear</span>
          </div>
          <h1 className="hero-title">
            Upgrade Your <br />
            <span className="gradient-text">Workspace</span> Experience
          </h1>
          <p className="hero-desc">
            Explore our curated line of premium acoustic headphones, high-refresh OLED displays, mechanical keyboards, and ambient studio lightbars.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">
              Shop Catalog <ArrowRight size={18} />
            </Link>
            <Link to="/catalog?category=lighting" className="btn-secondary">
              Browse Lighting
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card glass">
            <div className="hero-card-glow"></div>
            <img src="/images/headphones.png" alt="Aura Headphones Showcase" className="hero-image" />
            <div className="hero-card-details">
              <span className="badge-category">Featured Product</span>
              <h3>Aura SoundLink</h3>
              <p>Wireless Active Noise Cancelling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Curated gadgets for modern creators and enthusiasts.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/catalog?category=${cat.slug}`}
              className="category-card glass-interactive"
              style={{ "--accent-card": cat.color }}
            >
              <div className="category-icon-wrapper" style={{ color: cat.color }}>
                {cat.icon}
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-explore">
                Explore <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured container">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Sleek design, impeccable engineering.</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promos */}
      <section className="promos container">
        <div className="promo-card glass-interactive style-purple">
          <div className="promo-details">
            <span className="promo-label">Limited Edition</span>
            <h2>Apex Mechanical Keyboard</h2>
            <p>Customize your mechanical sound profile. In stock now with silent switches.</p>
            <Link to="/product/p2" className="btn-primary">
              View Specs
            </Link>
          </div>
          <div className="promo-image-wrapper">
            <img src="/images/keyboard.png" alt="Apex Keyboard Promo" />
          </div>
        </div>
      </section>
    </div>
  );
}
