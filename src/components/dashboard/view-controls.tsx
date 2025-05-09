"use client"

import { useState } from "react"
import { ViewToggle } from "~/components/ui/view-toggle"

interface ViewControlsProps {
  onViewChange?: (view: "list" | "grid") => void
  defaultView?: "list" | "grid"
  className?: string
}

export function ViewControls({
  onViewChange,
  defaultView = "grid",
  className
}: ViewControlsProps) {
  const [currentView, setCurrentView] = useState<"list" | "grid">(defaultView)
  
  const handleViewChange = (view: "list" | "grid") => {
    setCurrentView(view)
    onViewChange?.(view)
  }
  
  return (
    <div className={className}>
      <ViewToggle 
        defaultView={defaultView}
        onViewChange={handleViewChange}
      />
    </div>
  )
}