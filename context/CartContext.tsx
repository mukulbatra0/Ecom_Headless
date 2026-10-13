"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  regular_price?: string;
  image: string;
  slug: string;
  quantity: number;
  stock_status: string;
  stock_quantity: number | null;
}

interface CartState {
  items: CartItem[];
  coupon: { code: string; discount: number; type: string } | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number; type: string } }
  | { type: "REMOVE_COUPON" }
  | { type: "LOAD_CART"; payload: CartState };

interface CartContextType {
  items: CartItem[];
  coupon: CartState["coupon"];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number, type: string) => void;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIdx = state.items.findIndex((i) => i.id === action.payload.id);
      if (existingIdx >= 0) {
        const items = [...state.items];
        const maxQty = items[existingIdx].stock_quantity ?? 999;
        items[existingIdx] = {
          ...items[existingIdx],
          quantity: Math.min(items[existingIdx].quantity + action.payload.quantity, maxQty),
        };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [], coupon: null };
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "REMOVE_COUPON":
      return { ...state, coupon: null };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shopzen-cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("shopzen-cart", JSON.stringify(state));
  }, [state]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const applyCoupon = useCallback((code: string, discount: number, type: string) => {
    dispatch({ type: "APPLY_COUPON", payload: { code, discount, type } });
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const discount = state.coupon
    ? state.coupon.type === "percent"
      ? (subtotal * state.coupon.discount) / 100
      : state.coupon.discount
    : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
