import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load saved shelf from localStorage on init
  useEffect(() => {
    const storedCart = localStorage.getItem("lumina_shelf");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error parsing shelf items from localStorage", e);
      }
    }
  }, []);

  // Save shelf to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lumina_shelf", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // For digital library materials, quantity is usually capped at 1
        return prevItems;
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    // For digital materials, quantity is always 1, so we do nothing or just remove it if quantity <= 0
    if (quantity <= 0) {
      removeFromCart(productId);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length; // Count unique files
  const cartTotal = 0; // Everything is free access in library simulation

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
