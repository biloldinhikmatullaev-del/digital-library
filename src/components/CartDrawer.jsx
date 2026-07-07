import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { X, Trash2, ArrowRight, Download } from "lucide-react";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer glass" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="cart-drawer-title">Корзина</h3>
          <button className="close-btn" onClick={onClose} aria-label="Закрыть корзину">
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>В вашей корзине пока ничего нет.</p>
            <button className="btn-primary" onClick={onClose}>
              Перейти к каталогу
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-price">
                      {item.category === "tests" ? "Интерактивно" : `${item.format} • ${item.size || ""}`}
                    </p>
                    <span className="badge-category" style={{ fontSize: '0.7rem', padding: '2px 8px', width: 'fit-content' }}>
                      {item.category === "books" ? "Книга" : 
                       item.category === "lectures" ? "Лекция" : 
                       item.category === "presentations" ? "Презентация" : 
                       item.category === "manuals" ? "Методичка" : "Тест"}
                    </span>
                  </div>
                  <button
                    className="item-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Удалить"
                    title="Удалить из корзины"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Материалов:</span>
                <span className="summary-total">{cartItems.length} шт.</span>
              </div>
              <p className="summary-tax-note">Доступ предоставляется бесплатно для студентов и преподавателей.</p>
              
              <div className="cart-drawer-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Очистить
                </button>
                <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                  Скачать пакет <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
