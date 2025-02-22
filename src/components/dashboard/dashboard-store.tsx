import { type File, type Folder, type Workspace } from "@prisma/client";
import { create } from "zustand";
import { type BreadcrumbItem } from "./folder-breadcrumb";

type Parent = Workspace | Folder;

export interface DashboardStore {
  itemsHistory: Parent[];
  history: BreadcrumbItem[];
  files: File[];
  folders: Folder[];

  addItemsHistory: (item: BreadcrumbItem) => void;
  resetHistory: () => void;
  addFile: (file: File) => void;
  addFolder: (folder: Folder) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  itemsHistory: [],
  history: [],
  files: [],
  folders: [],

  addItemsHistory: (item) => set((state) => {
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

  addFile: (file) => set((state) => {
    if (!state.files.some(existingFile => existingFile.id === file.id)) {
      return { files: [...state.files, file] };
    }
    return state;
  }),

  addFolder: (folder) => set((state) => {
    if (!state.folders.some(existingFolder => existingFolder.id === folder.id)) {
      return { folders: [...state.folders, folder] };
    }
    return state;
  }),
}));