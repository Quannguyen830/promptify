'use client'

import { Home, Archive, Settings } from 'lucide-react'
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

const navigation = [
  { name: 'Home', icon: Home, href: 'dashboard' },
  { name: 'Sign In', icon: Archive, href: 'sign-in' },
  { name: 'Setting', icon: Settings, href: 'settings' },
  // { name: 'Team', icon: Users, href: '#' },
  // { name: 'Settings', icon: Settings, href: '#' },
]

export function Sidebar() {
  return (
    <SidebarCn defaultValue={25}>
      <SidebarHeader className='p-5'>
        {/* TODO: logo */}
        <h1 className='h-7 text-2xl font-bold text-justify'>promptify</h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='gap-0'>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} className='p-1'>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="px-4 hover:bg-primary/10 transition duration-200">
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

