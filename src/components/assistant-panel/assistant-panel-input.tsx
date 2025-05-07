"use client";

import { useRef, useState } from "react";

const AssistantPanelInput = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setFiles(prev => [...prev, file]);
        }
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setText(editorRef.current.innerText);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const handleSend = () => {
    // Process sending: text + files
    console.log("Sending message:", text);
    console.log("Files:", files);

    setText("");
    setFiles([]);
    if (editorRef.current) editorRef.current.innerText = "";
  };

  return (
    <div className="border-t border-gray-300 p-2 flex flex-col gap-2">
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onInput={handleInput}
        className="w-full min-h-[40px] max-h-[150px] overflow-y-auto border rounded px-2 py-1 focus:outline-none"
      />

      {files.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="border px-2 py-1 text-sm rounded bg-gray-100"
            >
              {file.name}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-600 hover:underline text-sm"
        >
          Upload file
        </button>
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>

      <input
        type="file"
        multiple
        accept="image/*,application/*"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AssistantPanelInput;
