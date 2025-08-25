import {
  ChatCompletionMessageParam,
  InitProgressReport,
  MLCEngine,
} from '@mlc-ai/web-llm';
import { ChatMessage } from './types';

export const llm = new MLCEngine();

export const initializeLLM = async (
  callback?: (p: InitProgressReport) => void,
) => {
  if (callback) {
    llm.setInitProgressCallback(callback);
  }

  await llm.reload('Llama-3.2-1B-Instruct-q4f16_1-MLC');
};

export const streamChat = async (
  messages: ChatMessage[],
  prompt: string,
  setMessages: (v: ChatMessage[]) => void,
) => {
  const chunks = await llm.chat.completions.create({
    messages: messages.concat({
      role: 'user',
      content: prompt,
    }) as ChatCompletionMessageParam[],
    stream: true,
  });

  let response = '';
  for await (const chunk of chunks) {
    response += chunk.choices[0]?.delta.content || '';
    setMessages([
      ...messages,
      { role: 'user', content: prompt },
      { role: 'assistant', content: response },
    ]);
  }

  return response;
};
