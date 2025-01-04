'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '~/components/share/sidebar'
import { ChatSection } from '~/components/share/chat-section'
import { MainContent } from '~/components/share/main-content'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable'
import { cn } from '~/lib/utils'

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mainPanelSize, setMainPanelSize] = useState(75)
  const [chatPanelSize, setChatPanelSize] = useState(35)

  useEffect(() => {
    if (isSidebarOpen) {
      setMainPanelSize(75)
      setChatPanelSize(25)
    } else {
      setMainPanelSize(66.67)
      setChatPanelSize(33.33)
    }
  }, [isSidebarOpen])

  return (
    <div>
      dashboard
    </div>
  )
}

