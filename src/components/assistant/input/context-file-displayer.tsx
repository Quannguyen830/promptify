"use client";

import { X } from "lucide-react";
import { useChatStore } from "~/components/chat/chat-store";

const ContextFileDisplayer = () => {
  const {
    contextFileIds,
    removeContextFileId
  } = useChatStore();
  
  return (
    <div className="flex gap-2">
      {contextFileIds.map((file, index) => (
        <div className="flex max-w-80" key={index}>
          <p className="truncate">{file.name}</p>
          
          <button onClick={() => removeContextFileId(file.id)} className="">
            <X className="h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
export default ContextFileDisplayer;