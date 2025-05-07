import { GeistSans } from "geist/font/sans";
import { AuthLogo } from "~/components/share/auth-logo";
import "~/styles/globals.css";

export default function GeneralLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <div className="">
            {children}
        </div>
      </body>
    </html>
  );
}