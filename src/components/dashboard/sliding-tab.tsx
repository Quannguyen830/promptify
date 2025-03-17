import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export function SlidingTab() {
  const [activeTab, setActiveTab] = useState("workspaces")

  return (
    <div className="w-auto">
      <div className="flex">
        <button
          onClick={() => setActiveTab("workspaces")}
          className={`px-4 py-2 relative ${activeTab === "workspaces"
            ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
            : "text-gray-600"
            }`}
        >
          Workspaces <span className="ml-1 text-xs bg-gray-200 px-1 rounded-full">1</span>
        </button>
        <button
          onClick={() => setActiveTab("task")}
          className={`px-4 py-2 relative ${activeTab === "task"
            ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
            : "text-gray-600"
            }`}
        >
          Task
        </button>
        <button
          onClick={() => setActiveTab("document")}
          className={`px-4 py-2 relative ${activeTab === "document"
            ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
            : "text-gray-600"
            }`}
        >
          Document
        </button>
        <button className="px-4 py-2 text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}
