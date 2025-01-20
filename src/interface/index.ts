export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseProps {
  onClick: () => void;
}

export interface UploadResponse {
  message: string;
  response?: string; // This is the S3 response
  error?: string;
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

