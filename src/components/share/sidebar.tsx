'use client'

import { Home, FileText, ChevronDown, Clock, Star, Trash2 } from 'lucide-react'
import {
  Sidebar as SidebarCn,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '~/components/ui/sidebar'
import { PromptifyLogo } from './promptify-logo'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

const mainNavigation = [
  { name: 'Dashboard', icon: Home, href: 'dashboard' },
  { name: 'AI Assistant', icon: FileText, href: 'ai-assistant' },
]

const quickAccess = [
  { name: 'Recent', icon: Clock, href: 'recents' },
  { name: 'Starred', icon: Star, href: 'starred' },
  { name: 'Deleted', icon: Trash2, href: 'deleted' },
]

export function Sidebar() {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const pathname = usePathname();

  const isActivePath = (href: string) => pathname.includes(href);

  return (
    <SidebarCn defaultValue={25}>
      <SidebarHeader className='p-5 h-16'>
        <PromptifyLogo />
      </SidebarHeader>

      <SidebarContent className='px-2'>
        <SidebarGroup className='border-b py-5'>
          <SidebarGroupContent>
            <SidebarMenu className='gap-1'>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    className={cn(
                      "flex items-center gap-3 w-full py-5 rounded-md transition-colors",
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

        <SidebarGroup className="py-2 border-b">
          <SidebarGroupContent>
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex items-center justify-between w-full px-2 py-2.5 rounded-md hover:bg-gray-200"
            >
              <span className="text-sm font-semibold">Workspace 1</span>
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
                      "flex items-center gap-3 w-full py-5 rounded-md transition-colors",
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

