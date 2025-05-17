import { useState, useCallback, useMemo } from 'react';
import { Message, Tool, Thread } from '../../types/chat';
import { mockTools } from '../../mock/mockData';
import { createInitialThread } from './threadUtils';
import { callToolSpecificApi } from './toolApi';
import { getGeminiHistory } from './messageUtils';
import { useDetailPanel } from './panelUtils';
import { ChatViewModel } from './types';
import { 
  createUserMessage,
  createErrorMessage,
  updateThreadWithMessages,
  hasThreadUsedTools
} from './threadMessageUtils';
import { createThreadStateManager } from './threadStateUtils';
import {
  handleGeminiChatStreaming,
  handleToolResponseStreaming
} from './streamingOperations';
import { v4 as uuidv4 } from 'uuid';
import { summarizeApiResponse, generateContentStream } from '../../llms/gemini';

// Type definitions for extracted functions
interface StreamingParams {
  userMessage: Message;
  updatedMessages: Message[];
  activeThreadId: string;
  updateThreadMessages: (threadId: string, messages: Message[]) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  messages: Message[];
}

interface ToolSelectionParams extends StreamingParams {
  content: string;
  selectedTools: Tool[];
  setToolUsed: (used: boolean) => void;
  openDetailPanel: (content: any) => void;
}

// Extracted function to handle Gemini streaming with history
async function handleGeminiStreamingWithHistory({
  userMessage,
  updatedMessages,
  activeThreadId,
  updateThreadMessages,
  setIsStreaming,
  setStreamingContent,
  messages
}: StreamingParams): Promise<void> {
  // Use Gemini for chat with streaming
  const chatHistory = getGeminiHistory(messages);
  
  // Create a placeholder message for streaming
  const assistantMessageId = uuidv4();
  const assistantMessage: Message = {
    id: assistantMessageId,
    content: '',
    role: 'assistant',
    timestamp: new Date(),
  };
  
  // Add the placeholder message to the thread
  const messagesWithPlaceholder = [...updatedMessages, assistantMessage];
  updateThreadMessages(activeThreadId, messagesWithPlaceholder);
  
  // Set streaming state
  setIsStreaming(true);
  setStreamingContent('');
  
  try {
    // Get streaming response
    const streamingResponse = await generateContentStream([userMessage], chatHistory);
    
    // Process the stream
    let fullContent = '';
    
    for await (const chunk of streamingResponse.stream) {
      if (chunk.text) {
        fullContent += chunk.text;
        setStreamingContent(fullContent);
        
        // Update the message with the current content
        const updatedAssistantMessage = {
          ...assistantMessage,
          content: fullContent,
        };
        
        const streamingMessages = [...updatedMessages, updatedAssistantMessage];
        updateThreadMessages(activeThreadId, streamingMessages);
      }
    }
    
    // Final update with complete content
    const finalAssistantMessage = {
      ...assistantMessage,
      content: fullContent,
    };
    
    const finalMessages = [...updatedMessages, finalAssistantMessage];
    updateThreadMessages(activeThreadId, finalMessages);
  } catch (error) {
    console.error('Error in streaming response:', error);
    throw error; // Let the outer catch block handle this
  } finally {
    setIsStreaming(false);
  }
}

// Extracted function to handle tool selection and processing
async function handleToolSelection({
  content,
  selectedTools,
  activeThreadId,
  updatedMessages,
  messages,
  userMessage,
  updateThreadMessages,
  setIsStreaming,
  setStreamingContent,
  setToolUsed,
  openDetailPanel
}: ToolSelectionParams): Promise<void> {
  const selectedTool = selectedTools[0]; // Currently only supporting one tool at a time
  
  // Call the tool-specific API
  const apiResponse = await callToolSpecificApi(content, selectedTool, activeThreadId);
  
  // Store the full API response for the detail panel
  openDetailPanel({
    toolName: selectedTool.name,
    response: apiResponse.toolResults?.[0]?.result || apiResponse.content
  });
  
  // Start streaming the summary
  setIsStreaming(true);
  setStreamingContent('');
  
  // Create a placeholder message that will be updated with streaming content
  const placeholderMessage: Message = {
    id: uuidv4(),
    content: '',
    role: 'assistant',
    timestamp: new Date(),
    isStreaming: true
  };
  
  const messagesWithPlaceholder = [...updatedMessages, placeholderMessage];
  updateThreadMessages(activeThreadId, messagesWithPlaceholder);
  
  // Start summarizing the API response
  const summaryStream = await summarizeApiResponse(
    typeof apiResponse.content === 'string' ? apiResponse.content : JSON.stringify(apiResponse.content),
    content // Original user query as context
  );
  
  let summaryText = '';
  
  // Process the streaming summary
  for await (const chunk of summaryStream) {
    if (chunk.text) {
      summaryText += chunk.text;
      setStreamingContent(summaryText);
      
      // Update the placeholder message with the current summary
      const updatedPlaceholder = {
        ...placeholderMessage,
        content: summaryText
      };
      
      // Create a new array with the updated placeholder message
      const currentMessages = messages.concat(userMessage);
      const messagesWithUpdatedPlaceholder = [
        ...currentMessages.slice(0, -1),
        updatedPlaceholder
      ];
      
      updateThreadMessages(activeThreadId, messagesWithUpdatedPlaceholder);
    }
  }
  
  // Create the final message with the complete summary
  const assistantMessage: Message = {
    id: apiResponse.id || uuidv4(),
    content: summaryText,
    role: 'assistant',
    timestamp: new Date(),
    toolResults: [{
      id: uuidv4(),
      toolName: selectedTool.name,
      result: 'View details for the complete response'
    }]
  };
  
  const finalMessages = [...updatedMessages, assistantMessage];
  updateThreadMessages(activeThreadId, finalMessages);
  
  // Mark that a tool has been used in this thread
  setToolUsed(true);
  setIsStreaming(false);
}

export const useChatViewModel = (): ChatViewModel => {
  const [threads, setThreads] = useState<Thread[]>([createInitialThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(threads[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableTools] = useState<Tool[]>(mockTools);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [isUseMockData, setIsUseMockData] = useState<boolean>(false);
  const [toolUsed, setToolUsed] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  
  // Get panel utilities
  const {
    detailPanelContent,
    isDetailPanelOpen,
    openDetailPanel,
    closeDetailPanel
  } = useDetailPanel();
  
  // Get current thread's messages using useMemo to prevent unnecessary dependency changes
  const { messages } = useMemo(() => {
    const thread = threads.find(thread => thread.id === activeThreadId) || threads[0];
    return {
      messages: thread?.messages || []
    };
  }, [threads, activeThreadId]);

  // Update messages in the current thread
  const updateThreadMessages = useCallback((threadId: string, updatedMessages: Message[]) => {
    setThreads(prevThreads => 
      prevThreads.map(thread => {
        if (thread.id === threadId) {
          return updateThreadWithMessages(thread, updatedMessages);
        }
        return thread;
      })
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !activeThreadId) return;
    
    const userMessage = createUserMessage(content);
    
    // Add user message to current thread
    const updatedMessages = [...messages, userMessage];
    updateThreadMessages(activeThreadId, updatedMessages);
    
    setIsLoading(true);
    
    try {
      // If tools have already been used in this thread, disable them
      if (toolUsed) {
        await handleGeminiStreamingWithHistory({
          userMessage,
          updatedMessages,
          activeThreadId,
          updateThreadMessages,
          setIsStreaming,
          setStreamingContent,
          messages
        });
      }
      // If a tool is selected and tools haven't been used yet in this thread
      else if (selectedTools.length > 0) {
        await handleToolSelection({
          content,
          selectedTools,
          activeThreadId,
          updatedMessages,
          messages,
          userMessage,
          updateThreadMessages,
          setIsStreaming,
          setStreamingContent,
          setToolUsed,
          openDetailPanel
        });
      } 
      // If no tool is selected and tools haven't been used yet
      else {
        await handleGeminiStreamingWithHistory({
          userMessage,
          updatedMessages,
          activeThreadId,
          updateThreadMessages,
          setIsStreaming,
          setStreamingContent,
          messages
        });
      }
    } catch (error) {
      // Handle API error
      console.error('Error processing message:', error);
      
      // Display error message to user
      const errorMessage = createErrorMessage(error);
      
      const finalMessages = [...updatedMessages, errorMessage];
      updateThreadMessages(activeThreadId, finalMessages);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [isLoading, selectedTools, messages, activeThreadId, updateThreadMessages, toolUsed, openDetailPanel]);

  const toggleTool = useCallback((toolId: string) => {
    // Only allow tool selection if no tool has been used in the current thread
    if (toolUsed) {
      return;
    }
    
    setSelectedTools((prevTools) => {
      const isToolSelected = prevTools.some((tool) => tool.id === toolId);
      if (isToolSelected) {
        // If the tool is already selected, deselect it (empty array)
        return [];
      } else {
        // If selecting a different tool, replace the entire selection with just this tool
        const toolToAdd = availableTools.find((tool) => tool.id === toolId);
        if (toolToAdd) {
          return [toolToAdd];
        }
        return [];
      }
    });
  }, [availableTools, toolUsed]);

  const clearChat = useCallback(() => {
    if (activeThreadId) {
      updateThreadMessages(activeThreadId, []);
    }
  }, [activeThreadId, updateThreadMessages]);
  
  const toggleMockData = useCallback(() => {
    setIsUseMockData(prev => !prev);
  }, []);
  
  const createThread = useCallback(() => {
    const newThread = createInitialThread();
    setThreads(prevThreads => [...prevThreads, newThread]);
    setActiveThreadId(newThread.id);
    
    // Reset states for new thread
    setSelectedTools([]);
    setToolUsed(false);
    setIsStreaming(false);
    setStreamingContent('');
    closeDetailPanel();
  }, [closeDetailPanel]);
  
  const selectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    
    // Reset tool usage state based on the selected thread
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setToolUsed(hasThreadUsedTools(thread));
    }
    
    // Close detail panel when switching threads
    closeDetailPanel();
  }, [threads, closeDetailPanel]);
  
  const deleteThread = useCallback((threadId: string) => {
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
  }, [activeThreadId]);

  return {
    messages,
    isLoading,
    selectedTools,
    availableTools,
    isUseMockData,
    threads,
    activeThreadId,
    detailPanelContent,
    isDetailPanelOpen,
    toolUsed,
    isStreaming,
    streamingContent,
    sendMessage,
    toggleTool,
    clearChat,
    toggleMockData,
    createThread,
    selectThread,
    deleteThread,
    openDetailPanel,
    closeDetailPanel,
  };
};
