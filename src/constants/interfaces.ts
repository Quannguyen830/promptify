import { type Folder, type Workspace } from "@prisma/client";

export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseProps {
  onClick: () => void;
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
}

export interface S3File {
  Key: string;
  LastModified: Date;
  Size: number;
  ETag: string;
}

export interface ApiResponse {
  Response: [];
}

export interface FileModel {
  name: string,
  size: number,
  type: string,
  workspaceId: string,
  folderId: string,
}

interface Root {
  id: string,
  name: string,
}

export type FolderHistoryItem = Workspace | Folder | Root;

export const MyDrive = {
  id: "root",
  name: "My Drive"
}

// CHAT SECTION
export interface ChatInputForm {
  userMessage: string
}

export interface ChatModel {
  value: string;
  name: string;
}

export interface ChatSessionCardProps extends BaseProps {
  title: string // TODO: consider rename to id
}
