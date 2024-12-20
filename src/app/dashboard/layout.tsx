import { SidebarProvider } from '~/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className=''>
      {children}
    </SidebarProvider>
  )
}

