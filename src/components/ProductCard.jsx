import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star, Play, ShoppingCart } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();

  const isSaved = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "books": return "Учебник";
      case "lectures": return "Лекция";
      case "presentations": return "Презентация";
      case "manuals": return "Методичка";
      case "theses": return "Диплом";
      case "dissertations": return "Диссертация";
      case "articles": return "Статья";
      case "journals": return "Журнал";
      case "archive": return "Архив";
      case "tests": return "Тест";
      case "instructions": return "Инструкция";
      case "regulations": return "Регламент";
      case "templates": return "Шаблон";
      case "training": return "Обучение";
      case "fiction": return "Литература";
      case "audiobooks": return "Аудиокнига";
      case "ebooks": return "Эл. книга";
      case "periodicals": return "Периодика";
      case "quizzes": return "Викторина";
      case "webdev": return "Сборник: Web";
      case "ai": return "Сборник: AI";
      case "databases": return "Сборник: БД";
      default: return cat;
    }
  };

  const getProductImageStyle = (id) => {
    const customCovers = ["b_eng", "b_rus", "b_math", "b_chio", "b_hist", "b_bio", "a1"];
    if (customCovers.includes(id)) {
      return {};
    }
    
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use golden angle for maximum color spreading
    const hue = Math.floor((Math.abs(hash) * 137.5) % 360);
    const sat = 4 + (Math.abs(hash % 3) * 0.5); // Saturation factor 4.0 to 5.0
    const brightness = 0.95 + (Math.abs(hash % 3) * 0.1); // Brightness 0.95 to 1.15
    return { 
      filter: `hue-rotate(${hue}deg) saturate(${sat}) brightness(${brightness}) contrast(1.1)`,
      transition: 'filter 0.3s ease'
    };
  };

  return (
    <div className="product-card glass-interactive">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-img-container">
          <img src={product.image} alt={product.name} className="product-image" style={getProductImageStyle(product.id)} />
          <span className="badge-category card-category">{getCategoryLabel(product.category)}</span>
          {product.plotMatchPercent !== undefined && product.plotMatchPercent > 0 && (
            <span className="plot-match-badge" style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(16, 185, 129, 0.9)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 3
            }}>
              🎯 Сюжет: {product.plotMatchPercent}%
            </span>
          )}
        </div>

        <div className="card-body">
          <div className="card-rating">
            <Star size={14} fill="currentColor" className="star-icon" />
            <span>{(product.rating <= 5.0 ? product.rating * 1.8 : product.rating).toFixed(1)} / 9</span>
          </div>

          <h3 className="card-title">{product.name}</h3>
          <p className="card-desc">{product.description}</p>

          <div className="card-footer">
            <span className="card-price" style={{ fontSize: '0.95rem', letterSpacing: 'normal' }}>
              {product.category === "tests" ? `${product.duration}` : `${product.format} (${product.size})`}
            </span>
            
            {product.category === "tests" ? (
              <span className="btn-primary card-add-btn" style={{ background: 'linear-gradient(135deg, var(--accent-secondary), #8b5cf6)' }}>
                <Play size={14} />
                <span>Пройти</span>
              </span>
            ) : (
              <button 
                className="btn-primary card-add-btn" 
                onClick={handleAddToCart}
                disabled={isSaved}
                title={isSaved ? "В корзине" : "В корзину"}
                aria-label={isSaved ? "В корзине" : "В корзину"}
              >
                <ShoppingCart size={14} fill={isSaved ? "currentColor" : "none"} />
                <span>{isSaved ? "В корзине" : "В корзину"}</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
