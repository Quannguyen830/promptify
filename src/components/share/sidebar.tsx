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
import { PromptifyLogo } from './promptify-logo'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from '../ui/avatar'

const navigation = [
  { name: 'Home', icon: Home, href: 'dashboard' },
  { name: 'Sign In', icon: Archive, href: 'sign-in' },
  { name: 'Setting', icon: Settings, href: 'settings' },
]

export function Sidebar() {
  const session = useSession();
  const firstLetter = session?.data?.user?.name?.charAt(0) ?? 'G';

  return (
    <SidebarCn defaultValue={25}>
      <SidebarHeader className='p-5 h-16'>
        <PromptifyLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='gap-0'>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} className='p-1 pt-0'>
                  <SidebarMenuButton className='h-10' asChild>
                    <Link href={item.href} className="px-4 py-0 hover:bg-primary/10 transition duration-200">
                      <item.icon className="h-6 w-6" />
                      <span className="font-semibold">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="flex items-center p-4 mb-10">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
        <span className="ml-2 text-sm truncate">{session?.data?.user?.email}</span>
      </div>
    </SidebarCn>
  )
}

