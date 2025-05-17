import { Message } from '../../types/chat';

// Convert messages to Gemini chat history format
export const getGeminiHistory = (messages: Message[]) => {
  return messages
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.content
    }));
};
