import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        if (res.ok) {
          const data = await res.json();
          const found = data.find((p) => p.id === id);
          if (found) {
            setProduct(found);
          } else {
            throw new Error("Product not found");
          }
        } else {
          throw new Error("API responded with error");
        }
      } catch (err) {
        console.warn("Failed fetching via API, loading mock product details...", err);
        // Fallback mock details
        const mockCatalog = [
          {
            id: "p1",
            name: "Aura SoundLink Headphones",
            price: 349.99,
            category: "audio",
            rating: 4.8,
            image: "/images/headphones.png",
            description: "Premium active noise-cancelling wireless headphones with audiophile-grade sound resolution and a seamless matte finish.",
            specs: ["Active Noise Cancelling", "40-hour Battery Life", "Bluetooth 5.2", "Hi-Res Audio Certified"],
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
            specs: ["Gateron Silent Switches", "PBT Double-Shot Keycaps", "Wireless & Wired Mode", "5-pin Hot-Swappable"],
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
            specs: ["3440 x 1440 resolution", "0.03ms response time", "240Hz refresh rate", "DisplayHDR True Black 400"],
            stock: 5
          },
          {
            id: "p4",
            name: "Chronos Smart Watch v2",
            price: 299.99,
            category: "wearables",
            rating: 4.6,
            image: "/images/watch.png",
            description: "Elegant health-tracking watch with a circular sapphire display, stainless steel case, and integrated GPS.",
            specs: ["Sapphire Glass", "Heart Rate & SpO2 tracker", "Built-in GPS", "7-day battery life"],
            stock: 15
          },
          {
            id: "p5",
            name: "Lumina Desk Ambient Lightbar",
            price: 79.99,
            category: "lighting",
            rating: 4.5,
            image: "/images/lightbar.png",
            description: "Smart ambient monitor lightbar with asymmetrical optical design, auto-dimming, and wireless controller.",
            specs: ["Asymmetric light path", "2700K-6500K color temp", "Wireless dial", "USB-C Powered"],
            stock: 20
          }
        ];
        const found = mockCatalog.find((p) => p.id === id);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-page loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page container no-product glass">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/catalog" className="btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQtyChange = (val) => {
    setQuantity(Math.max(1, Math.min(val, product.stock)));
  };

  const mockReviews = [
    {
      author: "Alex M.",
      rating: 5,
      date: "May 12, 2026",
      comment: "Absolutely incredible! The build quality feels exceptionally premium, and it performs better than described. Highly recommended."
    },
    {
      author: "Jessica T.",
      rating: 4,
      date: "June 28, 2026",
      comment: "Very sleek design, fits perfectly on my desk. Only minor issue is that setup took a bit of time, but once running, it's perfect."
    }
  ];

  return (
    <div className="product-details-page container">
      <Link to="/catalog" className="back-link">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="product-grid-layout">
        {/* Visual Showcase */}
        <div className="product-gallery glass">
          <img src={product.image} alt={product.name} className="main-display-image" />
        </div>

        {/* Product Details Section */}
        <div className="product-info-panel">
          <span className="badge-category">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className="star-icon"
                />
              ))}
            </div>
            <span className="rating-value">{product.rating.toFixed(1)}</span>
            <span className="reviews-count">(2 customer reviews)</span>
          </div>

          <div className="price-row">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            <span className={`stock-status ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </span>
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Add to Cart Actions */}
          <div className="actions-section">
            <div className="quantity-selector">
              <button onClick={() => handleQtyChange(quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQtyChange(quantity + 1)}>+</button>
            </div>
            <button
              className="btn-primary add-to-cart-big"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={20} />
              <span>Add to Shopping Bag</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="trust-badges-grid">
            <div className="trust-badge">
              <Truck size={18} />
              <span>Free Shipping</span>
            </div>
            <div className="trust-badge">
              <ShieldCheck size={18} />
              <span>2 Year Warranty</span>
            </div>
            <div className="trust-badge">
              <RefreshCw size={18} />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description / reviews */}
      <div className="tabs-container glass">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Technical Specifications
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Customer Reviews ({mockReviews.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" ? (
            <div className="specs-content">
              <ul className="specs-list">
                {product.specs &&
                  product.specs.map((spec, i) => (
                    <li key={i} className="spec-item">
                      <span className="spec-dot"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="reviews-content">
              {mockReviews.map((rev, i) => (
                <div key={i} className="review-card">
                  <div className="review-meta">
                    <span className="reviewer-name">{rev.author}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        fill={starIndex < rev.rating ? "currentColor" : "none"}
                        className="star-icon"
                      />
                    ))}
                  </div>
                  <p className="reviewer-text">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
