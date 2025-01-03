'use client'

import React, { useState } from 'react'
import { Navbar } from '~/components/share/navbar'
import { SidebarNav } from '~/components/share/sidebarComponent'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface UploadResponse {
  message: string;
  response?: string; // This is the S3 response
  error?: string;
}


export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", file.name);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json() as UploadResponse;
    console.log(result);
  }

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
            "w-1/6 border-r bg-background transition-all duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarNav />
        </aside>
        <main className="flex-1 p-4">
          {/* Upload Button */}
          <div className="flex justify-center items-center h-full">
            <input type="file" onChange={handleUpload} className="hidden" id="fileInput" />
            <label htmlFor="fileInput">
              <Button
                variant={"secondary"}
                className='p-5 text-xl'
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Upload Files
              </Button>
            </label>
          </div>
        </main>
      </div>
    </div>
  )
}
