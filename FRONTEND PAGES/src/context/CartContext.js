import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, size = "M", qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.productId && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId && i.size === size
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { ...product, size, qty }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const updateQty = (productId, size, qty) => {
    if (qty < 1) return removeFromCart(productId, size);
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, qty } : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalMRP = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalMRP }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
