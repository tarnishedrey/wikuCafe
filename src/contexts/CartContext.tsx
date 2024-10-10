import React, { createContext, useContext, useState } from "react";

interface CartItem {
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: any;
  type: "food" | "drink";
}

interface CartContextType {
  orders: CartItem[];
  addToCart: (item: CartItem) => void;
  reduceItem: (itemName: string) => void; // New reduce item function
  removeItem: (itemName: string) => void; // Remove item function
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<CartItem[]>([]);

  // Add item to cart or increase quantity if already in cart
  const addToCart = (item: CartItem) => {
    setOrders((prevOrders) => {
      const existingItemIndex = prevOrders.findIndex(
        (order) => order.name === item.name
      );

      if (existingItemIndex !== -1) {
        // Item exists, update the quantity
        const updatedOrders = [...prevOrders];
        updatedOrders[existingItemIndex].quantity += 1;
        return updatedOrders;
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prevOrders, { ...item, quantity: 1 }];
      }
    });
  };

  // Reduce item quantity by 1, remove if quantity reaches 0
  const reduceItem = (itemName: string) => {
    setOrders((prevOrders) => {
      return prevOrders
        .map((order) =>
          order.name === itemName
            ? { ...order, quantity: order.quantity - 1 }
            : order
        )
        .filter((order) => order.quantity > 0);
    });
  };

  // Remove an item from the cart
  const removeItem = (itemName: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.name !== itemName)
    );
  };

  const clearCart = () => {
    setOrders([]);
  };

  return (
    <CartContext.Provider
      value={{ orders, addToCart, reduceItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
