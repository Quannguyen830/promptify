'use client'

import { Folder, File, ChevronRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useState } from 'react'
import { type TreeItem } from '~/constants/interfaces'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

interface WorkspaceTreeProps {
  items: TreeItem[]
}

function TreeNode({ item }: { item: TreeItem }) {
  const [isOpen, setIsOpen] = useState(false)
  const isFolder = item.type === 'folder'

  return (
    <div className="ml-2">
      <div
        className={cn(
          "flex items-center py-1 rounded-md hover:bg-gray-200 cursor-pointer",
          "text-sm w-full"
        )}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <div className="flex items-center min-w-[24px] flex-shrink-0">
          <ChevronRight
            size={14}
            className={cn(
              "transition-transform",
              isFolder ? "visible" : "invisible",
              isOpen && "transform rotate-90"
            )}
          />
        </div>

        <div className="flex-shrink-0 mr-2">
          {isFolder ? (
            <Folder size={16} className="text-gray-600" />
          ) : (
            <File size={16} className="text-gray-600" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate block">{item.name}</span>
            </TooltipTrigger>
            <TooltipContent side="right" align="start">
              {item.name}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {isOpen && item.children && (
        <div className="ml-2 border-l border-gray-200">
          {item.children.map((child) => (
            <TreeNode key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export function WorkspaceTree({ items }: WorkspaceTreeProps) {
  return (
    <div className="py-2 overflow-hidden">
      {items.map((item) => (
        <TreeNode key={item.id} item={item} />
      ))}
    </div>
  )
} 