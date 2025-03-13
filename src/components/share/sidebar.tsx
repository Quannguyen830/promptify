'use client'

import { Home, FileText, ChevronDown, Clock, Star, Trash2, Airplay } from 'lucide-react'
import {
  Sidebar as SidebarCn,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { PromptifyLogo } from './promptify-logo'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'


export function Sidebar() {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const pathname = usePathname();
  
  const mainNavigation = useMemo(() => [
    { name: 'Dashboard', icon: Home, href: 'dashboard' },
    { name: 'AI Assistant', icon: FileText, href: 'assistant' },
  ], []);
  const quickAccess = useMemo(() => [
    { name: 'Recent', icon: Clock, href: 'recents' },
    { name: 'Starred', icon: Star, href: 'starred' },
    { name: 'Deleted', icon: Trash2, href: 'deleted' },
  ], []);

  const isActivePath = (href: string) => pathname.includes(href);

  return (
    <SidebarCn collapsible='icon' defaultValue={25}>
      <SidebarHeader className='flex justify-between flex-row px-4 py-6'>
        <PromptifyLogo />
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className='px-4'>
        <SidebarGroup className='border-b py-5'>
          <SidebarGroupContent>
            <SidebarMenu className='gap-1'>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    className={cn(
                      "flex items-center gap-2 w-full py-5 rounded-md transition-colors",
                      "hover:bg-gray-200",
                      isActivePath(item.href) && "bg-gray-200 font-medium"
                    )}
                    asChild
                  >
                    <Link className='flex items-center' href={item.href}>
                      <item.icon size={18} className={cn(
                        isActivePath(item.href) && "font-bold"
                      )} />
                      <span className="text-[15px] flex font-semibold">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-2 border-b">
          <SidebarGroupContent>
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex items-center justify-between w-full px-2 py-2.5 rounded-md hover:bg-gray-200"
            >
              <div className='flex flex-row gap-2'>
                <Airplay size={18} />
                <span className="text-sm font-semibold">Workspace 1</span>
              </div>

              <ChevronDown size={16} className={`transform transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
            </button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu className='gap-1'>
              {quickAccess.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    className={cn(
                      "flex items-center gap-2 w-full py-5 rounded-md transition-colors",
                      "hover:bg-gray-200",
                      isActivePath(item.href) && "bg-gray-200 font-medium"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon size={18} className={cn(
                        isActivePath(item.href) && "font-bold"
                      )} />
                      <span className="text-[15px] font-semibold">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarCn>
  )
}

