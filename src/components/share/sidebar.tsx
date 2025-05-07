'use client'

import { Home, FileText, Clock, Star, Trash2 } from 'lucide-react'
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
import { useDashboardStore } from '~/components/dashboard/dashboard-store'
import { type Workspace } from "@prisma/client"
import { type TreeItem } from '~/constants/interfaces'

export function Sidebar() {
  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { workspaces, files, folders } = useDashboardStore();

  const mainNavigation = useMemo(() => [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'AI Assistant', icon: FileText, href: '/assistant' },
  ], []);
  const quickAccess = useMemo(() => [
    { name: 'Recent', icon: Clock, href: '/recent' },
    { name: 'Starred', icon: Star, href: '/starred' },
    { name: 'Deleted', icon: Trash2, href: '/deleted' },
  ], []);

  const isActivePath = (href: string) => pathname === href || pathname.startsWith(href);

  const toggleWorkspace = (workspaceId: string) => {
    setOpenWorkspaces(prev => ({
      ...prev,
      [workspaceId]: !prev[workspaceId]
    }));
  };

  const buildWorkspaceTree = (workspace: Workspace) => {
    const workspaceFolders = folders.filter(f => f.workspaceId === workspace.id);
    const workspaceFiles = files.filter(f => f.workspaceId === workspace.id);

    const buildFolderTree = (parentFolderId: string | null): TreeItem[] => {
      const currentLevelFolders = workspaceFolders.filter(f => f.parentFolderId === parentFolderId);
      const currentLevelFiles = workspaceFiles.filter(f => f.folderId === parentFolderId);

      const folderItems: TreeItem[] = currentLevelFolders.map(folder => ({
        id: folder.id,
        name: folder.name,
        type: 'folder' as const,
        children: buildFolderTree(folder.id)
      }));

      const fileItems: TreeItem[] = currentLevelFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: 'file' as const
      }));

      return [...folderItems, ...fileItems];
    };

    const rootFolders = workspaceFolders.filter(f => !f.parentFolderId).map(folder => ({
      id: folder.id,
      name: folder.name,
      type: 'folder' as const,
      children: buildFolderTree(folder.id)
    }));

    const rootFiles = workspaceFiles.filter(f => !f.folderId).map(file => ({
      id: file.id,
      name: file.name,
      type: 'file' as const
    }));

    return [...rootFolders, ...rootFiles];
  };

  return (
    <SidebarCn collapsible='icon' defaultValue={25}>
      <SidebarHeader className='flex justify-between flex-row px-4 h-16 items-center'>
        <PromptifyLogo />
        <SidebarTrigger className='w-8' />
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

        {/* {workspaces.map((workspace) => (
          <SidebarGroup key={workspace.id} className="py-2 border-b">
            <SidebarGroupContent>
              <button
                onClick={() => toggleWorkspace(workspace.id)}
                className="flex items-center justify-between w-full px-2 py-2.5 rounded-md hover:bg-gray-200"
              >
                <div className='flex flex-row gap-2'>
                  <Airplay size={18} />
                  <span className="text-sm font-semibold">{workspace.name}</span>
                </div>

                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${openWorkspaces[workspace.id] ? 'rotate-180' : ''}`}
                />
              </button>

              {openWorkspaces[workspace.id] && (
                <WorkspaceTree items={buildWorkspaceTree(workspace)} />
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))} */}

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

