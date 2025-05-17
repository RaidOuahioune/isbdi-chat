import { Thread, Message, Tool } from '../../types/chat';
import { createInitialThread } from './threadUtils';
import { hasThreadUsedTools } from './threadMessageUtils';

/**
 * Creates a thread state manager with utility functions for thread operations
 * @param setThreads State setter for threads
 * @param setActiveThreadId State setter for active thread ID
 * @param setToolUsed State setter for tool usage flag
 * @param setSelectedTools State setter for selected tools
 * @param setIsStreaming State setter for streaming state
 * @param setStreamingContent State setter for streaming content
 * @param closeDetailPanel Function to close detail panel
 * @returns Object with thread state management functions
 */
export const createThreadStateManager = (
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>,
  setActiveThreadId: React.Dispatch<React.SetStateAction<string | null>>,
  setToolUsed: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTools: React.Dispatch<React.SetStateAction<Tool[]>>,
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>,
  setStreamingContent: React.Dispatch<React.SetStateAction<string>>,
  closeDetailPanel: () => void
) => {
  /**
   * Updates messages in a specific thread
   * @param threadId ID of the thread to update
   * @param updatedMessages New messages array
   * @param updateFn Function to update a thread with new messages
   */
  const updateThreadMessages = (
    threadId: string, 
    updatedMessages: Message[],
    updateFn: (thread: Thread, messages: Message[]) => Thread
  ) => {
    setThreads(prevThreads => 
      prevThreads.map(thread => {
        if (thread.id === threadId) {
          return updateFn(thread, updatedMessages);
        }
        return thread;
      })
    );
  };

  /**
   * Creates a new thread and sets it as active
   */
  const createThread = () => {
    const newThread = createInitialThread();
    setThreads(prevThreads => [...prevThreads, newThread]);
    setActiveThreadId(newThread.id);
    
    // Reset states for new thread
    setSelectedTools([]);
    setToolUsed(false);
    setIsStreaming(false);
    setStreamingContent('');
    closeDetailPanel();
  };

  /**
   * Selects a thread and updates related state
   * @param threadId ID of the thread to select
   * @param threads Current threads array
   */
  const selectThread = (threadId: string, threads: Thread[]) => {
    setActiveThreadId(threadId);
    
    // Reset tool usage state based on the selected thread
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setToolUsed(hasThreadUsedTools(thread));
    }
    
    // Close detail panel when switching threads
    closeDetailPanel();
  };

  /**
   * Deletes a thread
   * @param threadId ID of the thread to delete
   * @param activeThreadId ID of the currently active thread
   */
  const deleteThread = (threadId: string, activeThreadId: string | null) => {
    setThreads(prevThreads => {
      const updatedThreads = prevThreads.filter(thread => thread.id !== threadId);
      
      // If we're deleting the active thread, switch to the first thread
      // or create a new one if no threads remain
      if (activeThreadId === threadId) {
        if (updatedThreads.length === 0) {
          const newThread = createInitialThread();
          setActiveThreadId(newThread.id);
          return [newThread];
        }
        
        setActiveThreadId(updatedThreads[0].id);
      }
      
      return updatedThreads;
    });
  };

  /**
   * Clears all messages from a thread
   * @param threadId ID of the thread to clear
   */
  const clearChat = (threadId: string | null) => {
    if (threadId) {
      updateThreadMessages(threadId, [], (thread, _) => ({
        ...thread,
        messages: [],
        updatedAt: new Date()
      }));
    }
  };

  return {
    updateThreadMessages,
    createThread,
    selectThread,
    deleteThread,
    clearChat
  };
};
