export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseProps {
  onClick: () => void;
}

export interface FolderCardProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export interface FileCardProps {
  title: string
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
