import React from 'react';
import { BaseProps } from '~/app/constants/interfaces';

const ChatMessageList = ({children, className}: BaseProps) => {
  return (
    <div className={`overflow-y-auto h-full flex flex-col gap-2`}>
      {children}
    </div>
  );
};

export default ChatMessageList;