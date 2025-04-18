import { ImageIcon, Upload } from "lucide-react";

import { Button } from "~/components/ui/button";
import FileSelectorMenu from "./input-context/file-selector-menu";
import ModelSelector from "./model-selector";
import ContextFileDisplayer from "./context-file-displayer";


const AssistantInputToolbar = () => {
  return (
    <div className="flex flex-col">
      <div className={`flex justify-between w-full p-3 bg-stone-200 h-12 rounded-[8px]`}>
        <ModelSelector />


        <div className="flex flex-row items-center gap-4 h-full px-3">
          {/* create custom component for adding image and download */}
          <Button variant="ghost" className="p-2">
            <ImageIcon className="h-6" />
          </Button>

          <Button variant="ghost" className="p-2">
            <Upload className="h-6" />
          </Button>

          <FileSelectorMenu />
        </div>
      </div>

      <ContextFileDisplayer />
    </div>
  )
}

export default AssistantInputToolbar;