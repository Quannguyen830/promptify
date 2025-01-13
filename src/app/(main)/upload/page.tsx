'use client'

import { useSession } from 'next-auth/react';
import { Button } from '~/components/ui/button'

interface UploadResponse {
  message: string;
  response?: string; // This is the S3 response
  error?: string;
}

export default function Page() {
  const { data: session } = useSession();
  // console.log(session?.user.id)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", file.name);

    if (session?.user.id) {
      formData.append("userId", session.user.id);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json() as UploadResponse;
    console.log(result);
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden h-full">
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
