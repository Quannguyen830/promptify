import { type File, type Folder, type Workspace } from "@prisma/client";
import { type ChatProvider } from "./types";

export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseProps {
  onClick?: () => void;
}

export const GuestUser = {
  id: "guest-user",
  name: "Guest",
  email: "Guest",
}

// FILE SYSTEM
export interface FolderCardProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export interface FileCardProps {
  id: string
  title: string
  date: string
  subtitle: string
  image: string
  fileType: string
}

interface Root {
  id: string,
  name: string,
}

export const MyDrive = {
  id: "root",
  name: "My Drive"
}

export interface FolderHistoryItem extends Root {
  files?: File[];
  folders?: Folder[];
}

export type Parent = (Workspace & { files: File[] }) |
  (Folder & { files: File[] } & { workspaceId: string } & { workspaceName: string });

export type WorkspaceWithRelations = Workspace & {
  files: File[];
  folders: (Folder & { files: File[] })[];
};

export type FolderWithRelations = Folder & {
  files: File[];
};

export interface TreeItem {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: TreeItem[]
}

export interface FileUploadStatus {
  file: File;
  progress: number;
  uploading: boolean;
  error: boolean;
  fileSize: string;
}

// SEARCH SECTION

export interface SearchResult {
  _source: {
    content: string;
    key: string;
  };
  highlight?: {
    content: string[];
  };
}

// CHAT SECTION
export interface ChatInputForm {
  message: string
}

export interface ChatModel {
  name: string;
  value: ChatProvider;
}

export interface ChatTopicCardProps extends BaseProps {
  id: string;
  title?: string; // TODO: consider rename to id
  variant?: string;
  
}
