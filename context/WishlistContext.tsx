"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: string;
  regular_price?: string;
  image: string;
  slug: string;
  stock_status: string;
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR" }
  | { type: "LOAD"; payload: WishlistItem[] };

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function wishlistReducer(state: WishlistItem[], action: WishlistAction): WishlistItem[] {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.find((i) => i.id === action.payload.id)) return state;
      return [...state, action.payload];
    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.payload.id);
    case "CLEAR":
      return [];
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(wishlistReducer, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shopzen-wishlist");
      if (saved) dispatch({ type: "LOAD", payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("shopzen-wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const isInWishlist = useCallback((id: number) => items.some((i) => i.id === id), [items]);

  const toggleItem = useCallback(
    (item: WishlistItem) => {
      if (isInWishlist(item.id)) {
        dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } });
      } else {
        dispatch({ type: "ADD_ITEM", payload: item });
      }
    },
    [isInWishlist]
  );

  const clearWishlist = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
