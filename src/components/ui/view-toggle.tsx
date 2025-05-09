"use client"

import * as React from "react"
import { List, Grid } from "lucide-react"
import { cn } from "~/lib/utils"

interface ViewToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultView?: "list" | "grid"
  onViewChange?: (view: "list" | "grid") => void
}

export function ViewToggle({
  defaultView = "list",
  onViewChange,
  className,
  ...props
}: ViewToggleProps) {
  const [view, setView] = React.useState<"list" | "grid">(defaultView)

  const handleViewChange = (newView: "list" | "grid") => {
    setView(newView)
    onViewChange?.(newView)
  }

  return (
    <div
      className={cn(
        "flex h-10 w-[120px] items-center rounded-full border bg-background p-1",
        className
      )}
      {...props}
    >
      <button
        onClick={() => handleViewChange("list")}
        className={cn(
          "flex h-8 w-full items-center justify-center rounded-full transition-colors",
          view === "list" 
            ? "bg-primary/10 text-primary" 
            : "hover:bg-muted/50 text-muted-foreground"
        )}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleViewChange("grid")}
        className={cn(
          "flex h-8 w-full items-center justify-center rounded-full transition-colors",
          view === "grid" 
            ? "bg-primary/10 text-primary" 
            : "hover:bg-muted/50 text-muted-foreground"
        )}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </button>
    </div>
  )
}