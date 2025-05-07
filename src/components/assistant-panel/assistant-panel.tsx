import AssistantPanelMessageViewer from './assistant-panel-message-viewer';
import AssistantPanelInput from './assistant-panel-input';
import { type BaseProps } from '~/constants/interfaces';


export default function AssistantPanel({ className } : BaseProps) {
  return (
    <section className={`flex flex-col justify-between h-full ${className}`}>
      <div className="flex items-center px-3 border-b h-16">
        <h1 className="text-4xl font-semibold">Chat</h1>
      </div>

      <AssistantPanelMessageViewer />
      <AssistantPanelInput />
    </section>
  )
}

