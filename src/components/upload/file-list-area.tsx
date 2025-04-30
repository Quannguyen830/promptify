import { FileIcon, X } from "lucide-react";
import { FileUploadStatus } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { Progress } from "~/components/ui/progress";

interface FileListProps {
  fileUploadStatuses: FileUploadStatus[];
  isUploading: boolean;
  removeFile: (index: number) => void;
}

export function FileList({ fileUploadStatuses, isUploading, removeFile }: FileListProps) {
  if (fileUploadStatuses.length === 0) return null;
  
  return (
    <div className="max-h-60 overflow-y-auto space-y-3">
      {fileUploadStatuses.map((status, index) => (
        <div key={index} className="bg-muted p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-1 rounded">
                <FileIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{status.file.name}</p>
                <p className="text-xs text-muted-foreground">{status.fileSize}</p>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isUploading && (
            <>
              <Progress value={status.progress} className="h-2 w-full" />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">{Math.round(status.progress)}%</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
