import React, { createContext, useContext, useEffect, useState } from "react";

// Minimal compatible type for both Product and MarketplaceProduct
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isActive: boolean;
  store?: {
    id: number;
    name: string;
  };
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: any, quantity?: number, autoOpen?: boolean) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "p3d_cart_global";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Load initial state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, quantity: number = 1, autoOpen: boolean = true) => {
    if (product.isActive === false) {
      console.warn("Attempted to add inactive product to cart:", product.id);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((x) => x.id === product.id);

      if (existing) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, quantity: x.quantity + quantity } : x
        );
      }

      // Normalize product data to CartItem
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        isActive: true, // If we're here, it passed the initial check
        store: product.store ? {
          id: product.store.id,
          name: product.store.name
        } : undefined
      };

      return [...prev, newItem];
    });

    // Auto-open cart on add if requested
    if (autoOpen) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((x) => x.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
