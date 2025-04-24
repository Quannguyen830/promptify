import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { PromptifyLogo } from "~/components/share/promptify-logo"
import "~/styles/globals.css";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-white">
            <div className="w-full border-b border-gray-200">
              <div className="container mx-auto px-4 py-4">
                <PromptifyLogo className="h-8 w-auto" />
              </div>
            </div>

            <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}