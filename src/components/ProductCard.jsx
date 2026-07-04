import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star, ShoppingBag } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card glass-interactive">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-img-container">
          <img src={product.image} alt={product.name} className="product-image" />
          <span className="badge-category card-category">{product.category}</span>
        </div>

        <div className="card-body">
          <div className="card-rating">
            <Star size={14} fill="currentColor" className="star-icon" />
            <span>{product.rating.toFixed(1)}</span>
          </div>

          <h3 className="card-title">{product.name}</h3>
          <p className="card-desc">{product.description}</p>

          <div className="card-footer">
            <span className="card-price">${product.price.toFixed(2)}</span>
            <button 
              className="btn-primary card-add-btn" 
              onClick={handleAddToCart}
              title="Add to Cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
