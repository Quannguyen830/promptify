'use client'

import { Home, Mail, Archive, Trash2, Settings, Users } from 'lucide-react'
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
  { name: 'Home', icon: Home, href: '#' },
  { name: 'Messages', icon: Mail, href: '#' },
  { name: 'Archive', icon: Archive, href: '#' },
  { name: 'Trash', icon: Trash2, href: '#' },
  { name: 'Team', icon: Users, href: '#' },
  { name: 'Settings', icon: Settings, href: '#' },
]

export function SidebarNav() {
  return (
    <Sidebar className="h-[calc(100vh-3.5rem)] overflow-hidden">
      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="gap-3 px-3">
                    <a href={item.href}>
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

