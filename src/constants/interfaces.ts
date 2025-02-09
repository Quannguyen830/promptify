import { type Folder, type Workspace } from "@prisma/client";

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

export type FolderHistoryItem = Workspace | Folder | Root;

export const MyDrive = {
  id: "root",
  name: "My Drive"
}

export interface ApiResponse {
  message: string
  body: string
}

// CHAT SECTION
export interface ChatInputForm {
  message: string
}

export interface ChatModel {
  value: string;
  name: string;
}

export interface ChatSessionCardProps extends BaseProps {
  title: string // TODO: consider rename to id
}
