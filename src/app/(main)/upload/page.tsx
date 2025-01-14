'use client'

export default function Page() {

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* <div className="flex flex-1 overflow-hidden h-full">
        <main className="flex-1 p-4">
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
      </div> */}
    </div>
  )
}
