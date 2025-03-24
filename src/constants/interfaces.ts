import { type File, type Folder, type Workspace } from "@prisma/client";

export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseProps {
  onClick: () => void;
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
  title: string
  subtitle: string
  date: string
  imageUrl: string
  id: string
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

// CHAT SECTION
export interface ChatInputForm {
  message: string
}

export interface ChatModel {
  value: string;
  name: string;
}

export interface ChatSessionCardProps extends BaseProps {
  id: string;
  title?: string; // TODO: consider rename to id
  variant?: string;
  
}
