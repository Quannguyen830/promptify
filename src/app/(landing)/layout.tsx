import "~/styles/globals.css";

export default function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-screen h-screen font-general">
        <main className="h-full w-full">
          {children}
        </main>
      </body>
    </html>
  );
}