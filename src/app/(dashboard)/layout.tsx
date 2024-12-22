import { ThemeProvider } from '~/components/share/theme-provider'
import { SidebarProvider } from '~/components/ui/sidebar'
import { TRPCReactProvider } from '~/trpc/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <SidebarProvider className=''>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider> 
      </SidebarProvider>
  )
}

