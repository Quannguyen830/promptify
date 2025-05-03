import React from 'react'
import SearchViewer from '~/components/assistant/search/search-viewer'
import AssistantInput from '~/components/assistant/input/assistant-input'
import AssistantSidebar from '~/components/assistant/assistant-sidebar'

export default function SearchPage() {
  return (
    <div className="flex flex-row w-full h-full">
      {/* main assistant panel */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        <hgroup className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl">AI Ask</h3>
          <p>How can I help you today?</p>
        </hgroup>

        <SearchViewer />
        <AssistantInput />
      </div>

      <AssistantSidebar />
    </div>
  )
}
