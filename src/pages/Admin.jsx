import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2, LayoutGrid, ShieldAlert, Sparkles } from "lucide-react";
import "./Admin.css";

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "audio",
    image: "/images/headphones.png",
    description: "",
    specs: "",
    stock: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.warn("Using fallback catalog in Admin view");
        const mockCatalog = [
          { id: "p1", name: "Aura SoundLink Headphones", price: 349.99, category: "audio", stock: 12 },
          { id: "p2", name: "Apex Mechanical Keyboard", price: 189.99, category: "peripherals", stock: 8 },
          { id: "p3", name: "Horizon Curved OLED Monitor", price: 899.99, category: "displays", stock: 5 }
        ];
        setProducts(mockCatalog);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formattedProduct = {
      id: "p-" + Math.random().toString(36).substring(2, 7),
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      category: newProduct.category,
      image: newProduct.category === "keyboard" || newProduct.category === "peripherals" 
        ? "/images/keyboard.png" 
        : newProduct.category === "displays" 
          ? "/images/monitor.png" 
          : "/images/headphones.png", // standard placeholders mapping
      description: newProduct.description || "No description provided.",
      specs: newProduct.specs ? newProduct.specs.split(",").map(s => s.trim()) : ["Premium Build"],
      stock: parseInt(newProduct.stock) || 10,
      rating: 5.0
    };

    // Update products list in state (simulation)
    setProducts((prev) => [formattedProduct, ...prev]);

    // Show success message
    setMessage(`Successfully added "${formattedProduct.name}" to catalog simulation!`);
    
    // Clear form
    setNewProduct({
      name: "",
      price: "",
      category: "audio",
      image: "/images/headphones.png",
      description: "",
      specs: "",
      stock: ""
    });

    setTimeout(() => setMessage(""), 4000);
  };

  const handleDeleteProduct = (id, name) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setMessage(`Removed "${name}" from mock catalog.`);
    setTimeout(() => setMessage(""), 4000);
  };

  if (!user) {
    return (
      <div className="admin-page container guest-view glass">
        <ShieldAlert size={48} className="guest-icon" />
        <h2>Access Restricted</h2>
        <p>This page is reserved for administrators. Please log in first.</p>
        <Link to="/auth" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page container">
      <div className="ambient-glow" style={{ top: "0", left: "0" }}></div>

      <div className="admin-header">
        <h1 className="admin-title">Store Dashboard</h1>
        <p className="admin-subtitle">Simulate store inventory additions, catalog updates, and order control panels.</p>
      </div>

      {message && <div className="admin-alert glass">{message}</div>}

      <div className="admin-grid">
        {/* Create Product Form */}
        <section className="admin-form-section glass">
          <h3 className="admin-panel-title">
            <PlusCircle size={20} /> Add Simulated Product
          </h3>
          <form className="admin-form" onSubmit={handleAddProduct}>
            <div className="form-group">
              <label htmlFor="name">Product Title</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                required
                placeholder="e.g. Apex Keyboard Pro"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  className="input-field"
                  required
                  placeholder="249.99"
                  value={newProduct.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Initial Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  className="input-field"
                  required
                  placeholder="10"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="input-field"
                value={newProduct.category}
                onChange={handleInputChange}
              >
                <option value="audio">Audio</option>
                <option value="displays">Displays</option>
                <option value="peripherals">Peripherals</option>
                <option value="wearables">Wearables</option>
                <option value="lighting">Lighting</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Short Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="input-field textarea-field"
                placeholder="Write a brief overview of this product's features..."
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specs">Specs (Comma separated)</label>
              <input
                type="text"
                id="specs"
                name="specs"
                className="input-field"
                placeholder="Bluetooth 5.0, 30hr Battery, RGB lights"
                value={newProduct.specs}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn-primary admin-submit-btn">
              Add to Catalog
            </button>
          </form>
        </section>

        {/* Existing Products table simulation */}
        <section className="admin-inventory-section glass">
          <h3 className="admin-panel-title">
            <LayoutGrid size={20} /> Inventory Simulation
          </h3>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="table-id">{p.id}</td>
                      <td className="table-name">{p.name}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          className="table-delete-btn"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
