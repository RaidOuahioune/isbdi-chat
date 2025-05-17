import { v4 as uuidv4 } from 'uuid';
import { Message, Thread } from '../../types/chat';

/**
 * Extracts a title from a user message by taking the first few words
 * @param message The user message to extract a title from
 * @returns A string to use as thread title
 */
export const extractThreadTitleFromMessage = (message: Message): string => {
  if (message.role === 'user') {
    // Extract up to 5 words for the title
    const words = message.content.split(' ').slice(0, 5).join(' ');
    return words + (words.length < message.content.length ? '...' : '');
  }
  return 'New conversation';
};

/**
 * Updates a thread with new messages and automatically updates the title
 * @param thread The thread to update
 * @param updatedMessages The new messages array
 * @returns The updated thread object
 */
export const updateThreadWithMessages = (thread: Thread, updatedMessages: Message[]): Thread => {
  let title = thread.title;
  
  // Extract title from the first user message if available
  if (updatedMessages.length > 1) {
    const firstUserMessage = updatedMessages.find(m => m.role === 'user');
    if (firstUserMessage) {
      title = extractThreadTitleFromMessage(firstUserMessage);
    }
  }
  
  return {
    ...thread,
    messages: updatedMessages,
    title,
    updatedAt: new Date()
  };
};

/**
 * Creates a new user message object
 * @param content The message content
 * @returns A new Message object with user role
 */
export const createUserMessage = (content: string): Message => ({
  id: uuidv4(),
  content,
  role: 'user',
  timestamp: new Date(),
});

/**
 * Creates a new assistant message object
 * @param content The message content
 * @param toolResults Optional tool results to include
 * @returns A new Message object with assistant role
 */
export const createAssistantMessage = (content: string, toolResults?: any[]): Message => ({
  id: uuidv4(),
  content,
  role: 'assistant',
  timestamp: new Date(),
  ...(toolResults ? { toolResults } : {})
});

/**
 * Creates an error message from an error object
 * @param error The error that occurred
 * @returns A new Message object with assistant role containing the error message
 */
export const createErrorMessage = (error: unknown): Message => ({
  id: uuidv4(),
  content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Please try again later.'}`,
  role: 'assistant',
  timestamp: new Date(),
});

/**
 * Checks if a thread has any tool results in its messages
 * @param thread The thread to check
 * @returns Boolean indicating if any message has tool results
 */
export const hasThreadUsedTools = (thread: Thread): boolean => {
  return thread.messages.some(msg => msg.toolResults && msg.toolResults.length > 0);
};
