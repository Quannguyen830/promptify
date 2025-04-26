import { useMutation } from '@tanstack/react-query';
import { streamChatMessage } from '~/lib/chat/streamChatMessage';

type StreamChatParams = {
  chatSessionId: string;
  content: string;
  context: Array<{ content: string; sender: string }>;
  model: string;
  contextFiles: Array<{ id: string; name: string }>;
};

export function useStreamChatMutation() {
  return useMutation<ReadableStream<Uint8Array>, Error, StreamChatParams>({
    mutationFn: streamChatMessage,
  });
}
