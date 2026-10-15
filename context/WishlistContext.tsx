"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
  | { type: "ADD_MULTIPLE"; payload: WishlistItem[] }
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
  stockAlerts: number[];
  isAlertSet: (productId: number) => boolean;
  subscribeStockAlert: (productId: number, productName: string, email?: string) => Promise<{ success: boolean; message: string }>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function wishlistReducer(state: WishlistItem[], action: WishlistAction): WishlistItem[] {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.find((i) => i.id === action.payload.id)) return state;
      return [...state, action.payload];
    case "ADD_MULTIPLE": {
      const existingIds = new Set(state.map((i) => i.id));
      const toAdd = action.payload.filter((i) => !existingIds.has(i.id));
      return [...state, ...toAdd];
    }
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
  const [stockAlerts, setStockAlerts] = useState<number[]>([]);
  const { user } = useAuth();

  // Storage key is dynamic based on user ID or guest
  const storageKey = user?.id ? `shopzen-wishlist-user-${user.id}` : "shopzen-wishlist-guest";

  // Load wishlist on mount or user change
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(storageKey);
      let loaded: WishlistItem[] = savedUser ? JSON.parse(savedUser) : [];

      // If user just logged in, merge items from guest storage
      if (user?.id) {
        const guestData = localStorage.getItem("shopzen-wishlist-guest");
        if (guestData) {
          const guestItems: WishlistItem[] = JSON.parse(guestData);
          const existingIds = new Set(loaded.map((i) => i.id));
          const newItems = guestItems.filter((i) => !existingIds.has(i.id));
          if (newItems.length > 0) {
            loaded = [...loaded, ...newItems];
            localStorage.setItem(storageKey, JSON.stringify(loaded));
          }
          localStorage.removeItem("shopzen-wishlist-guest");
        }
      }

      dispatch({ type: "LOAD", payload: loaded });

      // Load stock alerts
      const savedAlerts = localStorage.getItem("shopzen-stock-alerts");
      if (savedAlerts) {
        setStockAlerts(JSON.parse(savedAlerts));
      }
    } catch {}
  }, [storageKey, user?.id]);

  // Save items whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }, [items, storageKey]);

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

  const isAlertSet = useCallback(
    (productId: number) => stockAlerts.includes(productId),
    [stockAlerts]
  );

  const subscribeStockAlert = useCallback(
    async (productId: number, productName: string, customEmail?: string) => {
      const emailToUse = customEmail || user?.email || "";
      if (!emailToUse) {
        return { success: false, message: "Please provide an email address for notifications." };
      }

      try {
        const res = await fetch("/api/products/stock-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            productName,
            email: emailToUse,
          }),
        });
        const data = await res.json();
        if (data.success) {
          const updated = Array.from(new Set([...stockAlerts, productId]));
          setStockAlerts(updated);
          localStorage.setItem("shopzen-stock-alerts", JSON.stringify(updated));
          return { success: true, message: data.message };
        }
        return { success: false, message: data.message || "Failed to set alert" };
      } catch {
        return { success: false, message: "Network error while setting stock alert" };
      }
    },
    [stockAlerts, user?.email]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
        clearWishlist,
        count: items.length,
        stockAlerts,
        isAlertSet,
        subscribeStockAlert,
      }}
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
