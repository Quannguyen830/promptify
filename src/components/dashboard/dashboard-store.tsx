import { type Folder, type Workspace } from "@prisma/client";
import { create } from "zustand";
import { type BreadcrumbItem } from "./folder-breadcrumb";

type Parent = Workspace | Folder;

export interface DashboardStore {
  itemsHistory: Parent[];
  history: BreadcrumbItem[];

  addItemsHistory: (item: BreadcrumbItem) => void;
  resetHistory: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  itemsHistory: [],
  history: [],

  addItemsHistory: (item) => set((state) => {
    // Check if the item already exists in the history
    if (!state.history.some(existingItem => existingItem.id === item.id)) {
      return {
        history: [...state.history, item],
      };
    }
    return state;
  }),

  resetHistory: () => {
    set({ history: [] })
  },
}));