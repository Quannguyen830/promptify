"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Search, File as FileIcon, Folder as FolderIcon, Clock, Briefcase } from "lucide-react"
import { useDashboardStore } from "./dashboard-store"
import { type File, type Folder } from "@prisma/client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

type SearchResult = File | Folder;

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { files, folders } = useDashboardStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        setIsLoading(true)
        setTimeout(() => {
          const results: SearchResult[] = [
            ...files.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
            ...folders.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
          ]
          setResults(results)
          setIsLoading(false)
          setShowSuggestions(true)
        }, 300)
      } else {
        setResults([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative flex-1" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search in Drive"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-secondary pl-10 pr-4 rounded-md border-none focus-visible:ring-1"
        />
      </div>
      {showSuggestions && (
        <div className="absolute mt-2 w-full bg-background rounded-lg border shadow-lg z-50 overflow-hidden">
          <ScrollArea className="max-h-[400px]">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <Button variant="ghost" key={result.id} className="w-full px-4 py-6 hover:bg-accent flex justify-start gap-3 text-sm" onClick={() => {
                    if (result.itemType === "file") {
                      router.push(`/file/${result.id}`);
                    } else if (result.itemType === "folder") {
                      router.push(`/folder/${result.id}`);
                    } else {
                      router.push(`/workspace/${result.id}`);
                    }
                  }}>
                    {result.itemType === "file" ? (
                      <FileIcon className="h-4 w-4 shrink-0" />
                    ) : result.itemType === "folder" ? (
                      <FolderIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <Briefcase className="h-4 w-4 shrink-0" />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{result.name}</span>
                      {result.updatedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.updatedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-muted-foreground">No results found</div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Try searching for files, folders, or shared items
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

