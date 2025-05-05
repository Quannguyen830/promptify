import { GeistSans } from "geist/font/sans";
import { AuthLogo } from "~/components/share/auth-logo";
import "~/styles/globals.css";

export default function UnauthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <div className="min-h-screen bg-white">
          <div className="w-full border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <AuthLogo className="h-8 w-auto" />
            </div>
          </div>

          <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}