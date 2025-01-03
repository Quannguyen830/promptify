import { Button } from "~/components/ui/button"
import { ThemeToggleMenu } from "~/components/share/theme-toggle-menu"
import { GithubIcon } from 'lucide-react'
import Link from "next/link"

export function Navbar() {
  return (
    <header className="py-0.5 px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-10 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-4 flex items-center space-x-2" href="/">
            <span className="font-bold text-xl">Promptify</span>
          </Link>
          <nav className="flex items-center space-x-6 text-md font-medium">
            {/* <Link className="transition-colors hover:text-foreground/80" href="/docs">Docs</Link>
            <Link className="transition-colors hover:text-foreground/80" href="/components">Components</Link>
            <Link className="transition-colors hover:text-foreground/80" href="/themes">Themes</Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <Button variant="outline" className="inline-flex items-center text-md">
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button> */}
          </div>
          <ThemeToggleMenu />
        </div>
      </div>
    </header>
  )
}

