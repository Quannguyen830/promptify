import "~/styles/globals.css";

import { ThemeProvider } from "~/components/share/theme-provider";
import { SidebarProvider } from "~/components/ui/sidebar";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

import { GeistSans } from "geist/font/sans";
import { Sidebar } from "~/components/share/sidebar";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useChatProvider } from "~/components/chat-section/chat-store";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_KEY ?? "");

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        {/* <ThemeProvider
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

        <main className='h-full'>
          {children}
        </main>
      </ResizablePanel>

      <ResizableHandle />

      {isOpen && (
        <ResizablePanel minSize={25}>
          <ChatSection />
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
                  </div >
                </div >
              </SidebarProvider >
            </SessionProvider >
          </TRPCReactProvider >
        </ThemeProvider >
      </body >
    </html >
  );
}