import { useState } from "react"
import { Button } from "~/components/ui/button"
import { useToast } from "~/hooks/use-toast"
import { copyToClipboard } from "~/lib/utils/copy-to-clipboard"
import { Copy, Check } from "lucide-react"

interface CopyLinkButtonProps {
  textToCopy: string
  successMessage?: string
  errorMessage?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function CopyLinkButton({
  textToCopy,
  successMessage = "Copied to clipboard",
  errorMessage = "Failed to copy to clipboard",
  variant = "outline",
  size = "default",
  className,
  children
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy)
    
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      toast({
        title: "Success",
        description: successMessage,
        variant: "success",
        className: "p-4",
      })
    } else {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        className: "p-4",
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCopy}
    >
      {children || (
        <>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied" : "Copy"}
        </>
      )}
    </Button>
  )
}