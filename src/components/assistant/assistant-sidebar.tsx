import { type BaseProps } from "~/constants/interfaces"

const AssistantSidebar: React.FC<BaseProps> = ({ className }) => {
  return (
    <aside className={`bg-gray-50 w-64 h-full${className}`}>

    </aside>
  )
}

export default AssistantSidebar;