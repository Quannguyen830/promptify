import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

export default function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="w-screen h-screen font-general">
          <main className="h-full w-full overflow-hidden">
            {children}
          </main>
        </body>
      </html>
    </TRPCReactProvider>
  );
}