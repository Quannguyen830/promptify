'use client'

import React, { useState } from 'react'
import { Navbar } from '~/components/share/navbar'
import { Sidebar } from '~/components/share/sidebar'
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
  }

  return (
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
  )
}
