import Image from "next/image"

interface FileTypeIconProps {
  fileType: string
  className?: string
}

export function FileTypeIcon({ fileType, className }: FileTypeIconProps) {
  if (fileType === 'application/pdf') {
    return (
      <Image
        src="/icon/pdf-icon.svg"
        alt="PDF icon"
        width={40}
        height={40}
        className={className}
      />
    )
  }
  
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileType === 'application/msword') {
    return (
      <Image
        src="/icon/docx-icon.svg"
        alt="DOCX icon"
        width={40}
        height={40}
        className={className}
      />
    )
  }
  
  // Default icon or other file types can be added here
  return null
}