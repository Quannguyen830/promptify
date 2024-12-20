'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '~/components/navbar'
import { SidebarNav } from '~/components/sidebarComponent'
import { ChatSection } from '~/components/chat-section'
import { MainContent } from '~/components/main-content'
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
    <div className="h-screen w-full flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden h-full">
        <aside
          className={cn(
            "w-1/6 border-r bg-background transition-all duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarNav />
        </aside>
        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "ml-0" : "ml-[-16rem]"
          )}
          onLayout={(sizes) => {
            setMainPanelSize(sizes[0] ?? 0)
            setChatPanelSize(sizes[1] ?? 0)
          }}
        >
          <ResizablePanel defaultSize={mainPanelSize} minSize={30}>
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b-[2px] p-3">
                <SidebarTrigger
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="mr-4"
                />
                <h1 className="text-2xl font-semibold">Dashboard</h1>
              </div>
              <MainContent />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={chatPanelSize} minSize={20}>
            <ChatSection />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

