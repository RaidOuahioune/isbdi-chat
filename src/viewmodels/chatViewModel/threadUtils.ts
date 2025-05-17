import { v4 as uuidv4 } from 'uuid';
import { Thread, Message } from '../../types/chat';

// Initial messages array starts empty
export const initialMessages: Message[] = [];

// Sample initial thread for demonstration
export const createInitialThread = (): Thread => ({
  id: uuidv4(),
  title: 'New conversation',
  createdAt: new Date(),
  updatedAt: new Date(),
  messages: [...initialMessages],
});
