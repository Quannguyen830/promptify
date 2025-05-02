import AssistantMessageViewer from "~/components/assistant/assistant-message-viewer";
import AssistantSidebar from "~/components/assistant/assistant-sidebar";
import AssistantInput from "~/components/assistant/input/assistant-input";
import AssistantInputToolbar from "~/components/assistant/input/assistant-input-toolbar";

export default function AssistantPage() {
  return (
    <div className="flex flex-row w-full h-full">
      {/* main assistant panel */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        <hgroup className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl">AI Ask</h3>
        </hgroup>

        {/* message viewer */}
        <AssistantMessageViewer />

        <div className={`flex flex-col justify-end gap-2 h-[161px] box-border w-full bg-gray-50 rounded-sm p-3`}>
          <AssistantInputToolbar />
          <AssistantInput />
        </div>

      </div>

      <AssistantSidebar />
    </div>
  )
} 