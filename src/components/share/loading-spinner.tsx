import React from "react"
import { Spinner } from "~/components/ui/spinner"
import { type BaseProps } from "~/constants/interfaces"

const Loading: React.FC<BaseProps> = ({className}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner className="text-primary" />
    </div>
  )
}
export default Loading;

