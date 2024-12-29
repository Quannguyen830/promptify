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
    <Sidebar className="h-full overflow-hidden w-full ">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-medium text-muted-foreground border-b-[2px] py-7 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="text-lg py-5 gap-3 hover:bg-gray-700 rounded-md transition duration-200">
                    <a href={item.href} className="flex items-center p-2">
                      <item.icon className="h-6 w-6" />
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

