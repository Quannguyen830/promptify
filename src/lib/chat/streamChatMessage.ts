export async function streamChatMessage({
  chatSessionId,
  content,
  context,
  model,
  contextFiles,
}: {
  chatSessionId: string;
  content: string;
  context: Array<{ content: string; sender: string }>;
  model: string;
  contextFiles: Array<{ id: string; name: string }>;
}): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatSessionId,
      content,
      context,
      model,
      contextFiles,
    }),
  });

  if (!response.ok) {
    const error: unknown = await response.json();
    console.log(error)
    // throw new Error(error.message ?? 'Failed to send message');
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  return response.body;
}