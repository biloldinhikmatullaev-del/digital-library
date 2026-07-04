import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
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
          <h3 className="cart-drawer-title">Shopping Cart</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="btn-primary" onClick={onClose}>
              Start Shopping
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
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <div className="item-qty-control">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="item-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-total">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="summary-tax-note">Shipping & taxes calculated at checkout.</p>
              
              <div className="cart-drawer-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                  Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
