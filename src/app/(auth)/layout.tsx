import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
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
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}