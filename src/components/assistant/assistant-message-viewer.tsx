"use client";

import { useSession } from "next-auth/react";
import { type BaseProps } from "~/constants/interfaces";
import Loading from "../share/loading-spinner";


const AssistantMessageViewer: React.FC<BaseProps> = ({ className }) => {
  const { data, status } = useSession();

  if (status==="loading") {
    return <Loading/>
  }

  // if no message yet
  return (
    <div className={`flex flex-col h-full justify-center items-center ${className}`}>
      <h2 className="text-[42px] font-bold">Hi {data?.user.name ?? "user"}</h2>
      <p>Start by asking anything below.</p>
    </div>
  )
}

export default AssistantMessageViewer;