import { Upload } from "lucide-react"
import { type ChangeEvent } from "react"

interface FileDropZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropZone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  fileInputRef,
  handleFileChange
}: FileDropZoneProps) {
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center h-48 cursor-pointer
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <Upload className="h-12 w-12 text-muted-foreground mb-3" />
      <p className="text-sm font-medium">Drag your file(s) or browse</p>
      <p className="text-xs text-muted-foreground mt-1">Max 10 MB files are allowed</p>
      <input
        ref={fileInputRef}
        type="file"
        multiple={true}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.doc,.csv"
      />
    </div>
  );
}
