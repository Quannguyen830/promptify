import { type Workspace, type File, type Folder } from "@prisma/client";
import { create } from "zustand";
import { type BreadcrumbItem } from "./folder-breadcrumb";
import { type Parent } from "~/constants/interfaces";

export interface DashboardStore {
  itemsHistory: Parent[];
  history: BreadcrumbItem[];
  files: File[];
  folders: Folder[];
  currentParent: Parent | null;
  workspaces: Workspace[];

  addItemsHistory: (item: BreadcrumbItem) => void;
  resetHistory: () => void;
  addFile: (file: File) => void;
  addFolder: (folder: Folder) => void;
  addWorkspace: (workspace: Workspace) => void;
  setCurrentParent: (parent: Parent | null) => void;
  resetCurrentParent: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  itemsHistory: [],
  history: [],
  files: [],
  folders: [],
  currentParent: null,
  workspaces: [],


  addItemsHistory: (item) => set((state) => {
    if (!state.history.some(existingItem => existingItem.id === item.id)) {
      return {
        history: [...state.history, item],
      };
    }
    return state;
  }),

  addWorkspace: (workspace) => set((state) => {
    if (!state.workspaces.some(existingWorkspace => existingWorkspace.id === workspace.id)) {
      return { workspaces: [...state.workspaces, workspace] };
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

  setCurrentParent: (parent) => set({ currentParent: parent }),

  resetCurrentParent: () => set({ currentParent: null }),
}));