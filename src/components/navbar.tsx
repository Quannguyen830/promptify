import { Button } from "~/components/ui/button"
import { ModeToggle } from "~/components/mode-toggle"
import { GithubIcon } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">MyApp</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80" href="/docs">Docs</a>
            <a className="transition-colors hover:text-foreground/80" href="/components">Components</a>
            <a className="transition-colors hover:text-foreground/80" href="/themes">Themes</a>
          </nav>
        </div>a
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="inline-flex items-center">
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

