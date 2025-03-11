import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export function Toolbox() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort:</span>
      <Button variant="ghost" className="h-8 text-sm font-normal">
        Last modified
        <ChevronDown size={16} className="ml-1" />
      </Button>
    </div>
  )
}
