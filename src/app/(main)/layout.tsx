import "~/styles/globals.css";

import { SidebarProvider } from "~/components/ui/sidebar";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

import { GeistSans } from "geist/font/sans";

import { Sidebar } from "~/components/share/sidebar";
import { Toaster } from "~/components/ui/toaster";
import AssistantPanelProvider from "~/components/assistant-panel/assistant-panel-provider";

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
        > */}
        <TRPCReactProvider>
          <SessionProvider>
            <SidebarProvider>
              <div 
                className="h-screen w-full overflow-hidden flex"
              >
                <Sidebar />

                <AssistantPanelProvider>
                  {children}
                </AssistantPanelProvider>
              </div>
              <Toaster />
            </SidebarProvider>
          </SessionProvider>
        </TRPCReactProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
