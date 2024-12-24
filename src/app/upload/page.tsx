'use client'

import React, { useState } from 'react'
import { Navbar } from '~/components/share/navbar'
import { SidebarNav } from '~/components/share/sidebarComponent'
import { cn } from '~/lib/utils'

export default function Page() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // useEffect(() => {
  //   if (isSidebarOpen) {
  //     setMainPanelSize(75)
  //     setChatPanelSize(25)
  //   } else {
  //     setMainPanelSize(66.67)
  //     setChatPanelSize(33.33)
  //   }
  // }, [isSidebarOpen])

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden h-full">
        <aside
          className={cn(
            "w-1/6 border-r bg-background transition-all duration-300 ease-in-out"
            // isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarNav />
        </aside>
      </div>
    </div>
  )
}
