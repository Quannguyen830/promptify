import { type BaseProps } from "~/constants/interfaces";

const AssistantInput: React.FC<BaseProps> = () => {
  return (
    <form className="h-40 w-full bg-gray-50 rounded-sm">
      
      <textarea className="bg-transparent resize-none focus:outline-none" placeholder="Ask me anything" />
    </form>
  )
}
export default AssistantInput;