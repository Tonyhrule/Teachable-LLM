import { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

export type ChatMessage = Omit<ChatCompletionMessageParam, 'content'> & {
  content: string;
};
