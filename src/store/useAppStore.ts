"use client";

import { create } from "zustand";

type FeedFilter = "all" | "friends" | "categories" | "care";

type AppState = {
  feedFilter: FeedFilter;
  setFeedFilter: (filter: FeedFilter) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  feedFilter: "all",
  setFeedFilter: (filter) => set({ feedFilter: filter }),
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

