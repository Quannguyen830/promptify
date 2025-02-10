"use client"

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "~/components/share/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { cn } from "~/lib/utils";
import { ChatSection } from "~/components/chat-section/chat-section";
import { Sidebar } from "~/components/share/sidebar";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "~/components/dashboard/navbar";
import { useEffect } from "react";
import { useChatProvider } from "~/components/chat-section/chat-store";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const { toggleOpen, isOpen } = useChatProvider();

  // useEffect(() => {
  //   const handleKeyPress = (e: KeyboardEvent) => {
  //     if (e.key.toLowerCase() === 'l' && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       toggleOpen();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyPress);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, [toggleOpen])

  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <SessionProvider>
              <SidebarProvider>
                <div className="h-screen w-full flex flex-col bg-background">
                  <div className="flex flex-1 overflow-hidden h-full">
                    <Sidebar />

                    <ResizablePanelGroup
                      direction="horizontal"
                      className={cn(
                        "flex-1 transition-all duration-300 ease-in-out"
                      )}
                    >
                      <ResizablePanel className="px-5" defaultSize={80} minSize={30}>
                        {/* <Navbar /> */}

                        <main className='pb-5 h-full'>
                          {children}
                        </main>
                      </ResizablePanel>

                      <ResizableHandle />

                      <ResizablePanel minSize={20}>
                        <ChatSection />
                      </ResizablePanel>
                      {/* {isOpen && (
                      )} */}
                    </ResizablePanelGroup>
                  </div>
                </div>
              </SidebarProvider>
            </SessionProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}