import { Folder, Workspace } from "@prisma/client";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft } from "lucide-react";

// Location Display Component
interface LocationDisplayProps {
  selectedParent: Workspace | Folder | null;
}

export function LocationDisplay({ selectedParent }: LocationDisplayProps) {
  return (
    <div className="space-y-2 pt-4 border-t mt-4">
      <Label className="font-medium">Location</Label>
      <div className="flex items-center gap-2 text-sm mt-2">
        <span>Home</span>
        <ArrowLeft className="h-3 w-3 rotate-180" />
        <span>{selectedParent?.name || "Select location"}</span>
      </div>
    </div>
  );
}