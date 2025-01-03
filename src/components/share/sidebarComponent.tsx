'use client'

import { Home, Archive, MessageCircle } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '~/components/ui/sidebar'

const navigation = [
  { name: 'Home', icon: Home, href: 'dashboard' },
  { name: 'Upload', icon: MessageCircle, href: 'upload' },
  { name: 'Sign In', icon: Archive, href: 'sign-in' },
  // { name: 'Trash', icon: Trash2, href: '#' },
  // { name: 'Team', icon: Users, href: '#' },
  // { name: 'Settings', icon: Settings, href: '#' },
]

export function SidebarNav() {
  return (
    <Sidebar className="h-full overflow-hidden w-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-medium text-muted-foreground border-b py-2.5 mb-2 h-10 flex items-center">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="text-sm py-2.5 gap-2 hover:bg-gray-700 rounded-md transition duration-200">
                    <a href={item.href} className="flex items-center p-1.5">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

