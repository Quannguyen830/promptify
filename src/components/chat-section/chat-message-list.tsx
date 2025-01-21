import React from 'react';
import { type BaseProps } from '~/interface';

const ChatMessageList = ({children, className}: BaseProps) => {
  return (
    <div className={`overflow-y-auto h-full flex flex-col gap-2 p-4 ${className}`}>
      {children}
    </div>
  );
};

export default ChatMessageList;