'use client'

import { Home, Mail, Archive, Trash2, Settings, Users, MessageCircle } from 'lucide-react'
import {
  Sidebar as SidebarCn,
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
  // { name: 'Archive', icon: Archive, href: '#' },
  // { name: 'Trash', icon: Trash2, href: '#' },
  // { name: 'Team', icon: Users, href: '#' },
  // { name: 'Settings', icon: Settings, href: '#' },
]

export function Sidebar() {
  return (
    <SidebarCn collapsible='icon' className="h-full overflow-hidden w-full ">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className=''>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} className='p-1'>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="px-4 hover:bg-gray-300 transition duration-200">
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
    </SidebarCn>
  )
}

