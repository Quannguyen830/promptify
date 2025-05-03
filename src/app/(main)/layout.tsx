import "~/styles/globals.css";

import { SidebarProvider } from "~/components/ui/sidebar";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "~/components/ui/toaster";

import { GeistSans } from "geist/font/sans";
import { Sidebar } from "~/components/share/sidebar";

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
              <div className="h-screen w-full overflow-hidden flex">
                <Sidebar />

                <main className='flex-1 w-full h-full'>
                  {children}
                </main>
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
