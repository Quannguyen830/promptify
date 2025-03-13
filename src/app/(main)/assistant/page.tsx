import AssistantInput from "~/components/assistant/assistant-input";
import AssistantMessageViewer from "~/components/assistant/assistant-message-viewer";
import AssistantSidebar from "~/components/assistant/assistant-sidebar";

export default function AssistantPage() {
  return (
    <div className="flex flex-row w-full h-full">
      {/* main assistant panel */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        <hgroup className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl">AI Ask</h3>
          <p>How can I help you today?</p>
        </hgroup>

        {/* message viewer */}
        <AssistantMessageViewer />
        <AssistantInput />
      </div>

      <AssistantSidebar className="" />
    </div>
  )
} 