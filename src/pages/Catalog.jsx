import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import "./Catalog.css";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("default");

  // Read URL query parameters on load
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          throw new Error("Failed to load products");
        }
      } catch (err) {
        console.warn("Failed fetching from Netlify, loading fallback mock catalog...", err);
        const mockCatalog = [
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
          },
          {
            id: "p4",
            name: "Chronos Smart Watch v2",
            price: 299.99,
            category: "wearables",
            rating: 4.6,
            image: "/images/watch.png",
            description: "Elegant health-tracking watch with a circular sapphire display, stainless steel case, and integrated GPS.",
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
            stock: 20
          }
        ];
        setProducts(mockCatalog);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update selected category if category URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam]);

  // Apply filters, search and sorting
  useEffect(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Price range filter
    result = result.filter((product) => product.price <= maxPrice);

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    handleCategoryChange("all");
    setMaxPrice(1000);
    setSortBy("default");
  };

  const categories = ["all", "audio", "displays", "peripherals", "wearables", "lighting"];

  return (
    <div className="catalog-page container">
      <div className="ambient-glow" style={{ top: "100px", left: "10%" }}></div>

      <div className="catalog-header">
        <h1 className="catalog-title">Shop Collection</h1>
        <p className="catalog-subtitle">Filter through our high-performance setups.</p>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar glass">
          <div className="sidebar-section">
            <h3 className="section-heading">
              <SlidersHorizontal size={18} /> Filters
            </h3>
          </div>

          {/* Search bar */}
          <div className="sidebar-section">
            <label className="filter-label">Search</label>
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Find a product..."
                className="input-field search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-section">
            <label className="filter-label">Categories</label>
            <div className="categories-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="sidebar-section">
            <div className="price-range-header">
              <label className="filter-label">Max Price</label>
              <span className="price-value">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              className="price-slider"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="price-slider-labels">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>

          {/* Reset button */}
          <button className="btn-secondary reset-btn" onClick={handleResetFilters}>
            <RefreshCw size={16} /> Reset Filters
          </button>
        </aside>

        {/* Catalog Main Panel */}
        <main className="catalog-main">
          {/* Sorting Header */}
          <div className="catalog-sorting-bar glass">
            <div className="results-count">
              Showing <span>{filteredProducts.length}</span> products
            </div>
            <div className="sort-selector-wrapper">
              <label htmlFor="sort-select">Sort by</label>
              <select
                id="sort-select"
                className="input-field sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results glass">
              <h3>No products found</h3>
              <p>Try adjusting your search filters or resetting them.</p>
              <button className="btn-primary" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
