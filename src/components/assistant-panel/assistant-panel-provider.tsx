"use client";

import { type BaseProps } from "~/constants/interfaces";
import AssistantPanel from "./assistant-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AssistantPanelProvider = ({ children } : BaseProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcut when focus is inside an input or textarea
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditable = ['input', 'textarea'].includes(tag) || (e.target as HTMLElement).isContentEditable;
      if (isEditable) return;
  
      const isKeyL = e.key.toLowerCase() === 'l';
      const hasShift = e.shiftKey;
      const hasModifier = e.ctrlKey || e.metaKey;
  
      if (isKeyL && hasShift && hasModifier) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    }
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pathname.includes("/file")) return (
    <main className='flex flex-1 flex-row w-full h-full'>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          {children}
        </ResizablePanel>

        {isOpen && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
              <AssistantPanel className="relative"/>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  )

  return (
    <main className='w-full h-full'>
      <ResizablePanelGroup direction="horizontal">
        {children}
      </ResizablePanelGroup>
    </main>
  )
}
export default AssistantPanelProvider;