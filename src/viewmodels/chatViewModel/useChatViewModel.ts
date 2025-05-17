import { useState, useCallback, useMemo } from 'react';
import { Message, Tool, Thread, AgentSelection } from '../../types/chat';
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
import { summarizeApiResponse, generateContentStream, detectAgent } from '../../llms/gemini';

// Type definitions for extracted functions
interface StreamingParams {
  userMessage: Message;
  updatedMessages: Message[];
  activeThreadId: string;
  updateThreadMessages: (threadId: string, messages: Message[]) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  messages: Message[];
  updateThreadAgentSelection?: (threadId: string, agentSelection: AgentSelection) => void;
}

interface ToolSelectionParams extends StreamingParams {
  content: string;
  selectedTools: Tool[];
  setToolUsed: (used: boolean) => void;
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
  updateThreadMessages,
  setIsStreaming,
  setStreamingContent,
  setToolUsed
}: ToolSelectionParams): Promise<void> {
  const selectedTool = selectedTools[0]; // Currently only supporting one tool at a time
  
  try {
    // Call the tool-specific API
    const apiResponse = await callToolSpecificApi(content, selectedTool, activeThreadId);
    
    // Store the API response data in the message for later use in the detail panel
    // But don't automatically open the panel
    
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
    
    try {
      // Process the streaming response
      for await (const chunk of summaryStream) {
        if (chunk.text) {
          summaryText += chunk.text;
          setStreamingContent(summaryText);
          
          // Update the placeholder message with the current content
          const updatedPlaceholderMessage = {
            ...placeholderMessage,
            content: summaryText,
          };
          
          const streamingMessages = [...updatedMessages, updatedPlaceholderMessage];
          updateThreadMessages(activeThreadId, streamingMessages);
        }
      }
      
      // Create the final message with the complete summary and tool results
      const finalAssistantMessage: Message = {
        id: uuidv4(),
        content: summaryText,
        role: 'assistant',
        timestamp: new Date(),
        toolResults: apiResponse.toolResults
      };
      
      // Update the thread with the final message
      const finalMessages = [...updatedMessages, finalAssistantMessage];
      updateThreadMessages(activeThreadId, finalMessages);
      
      // Mark that tools have been used in this thread
      setToolUsed(true);
    } catch (error) {
      console.error('Error in streaming summary:', error);
      throw error; // Let the outer catch block handle this
    } finally {
      setIsStreaming(false);
    }
  } catch (error) {
    // Check if the error is related to missing required information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Create an error message to display to the user
    const assistantErrorMessage: Message = {
      id: uuidv4(),
      content: errorMessage.includes('Missing required information') ?
        `I need more information to design this product. ${errorMessage}` :
        `Error using ${selectedTool.name}: ${errorMessage}`,
      role: 'assistant',
      timestamp: new Date(),
      // Add a custom property to the toolResults to indicate this is an error
      toolResults: [{
        id: uuidv4(),
        toolName: selectedTool.name,
        result: { error: errorMessage }
      }]
    };
    
    // Add the error message to the thread
    const finalMessages = [...updatedMessages, assistantErrorMessage];
    updateThreadMessages(activeThreadId, finalMessages);
    
    // Don't mark tool as used if there was an error due to missing information
    if (!errorMessage.includes('Missing required information')) {
      setToolUsed(true);
    }
    
    // Re-throw to be caught by the outer catch block
    throw error;
  }
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
  const [isAutoDetectAgent, setIsAutoDetectAgent] = useState<boolean>(true);
  const [isDetectingAgent, setIsDetectingAgent] = useState<boolean>(false);

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

  // Update thread messages
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

  // Update thread agent selection
  const updateThreadAgentSelection = useCallback((threadId: string, agentSelection: AgentSelection) => {
    setThreads(prevThreads => 
      prevThreads.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            agentSelection,
            agentId: agentSelection.agentId
          };
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
      // If auto-detect agent is enabled and no tools have been used yet, detect the appropriate agent
      if (isAutoDetectAgent && !toolUsed && selectedTools.length === 0) {
        setIsDetectingAgent(true);
        try {
          const detectedAgent = await detectAgent(content);
          if (detectedAgent) {
            // If the detected agent is 'chat', clear any selected tools
            if (detectedAgent.agentId === 'chat') {
              // Update the thread with the chat agent
              updateThreadAgentSelection(activeThreadId, {
                agentId: 'chat',
                reason: detectedAgent.reason,
                status: 'suggested',
                requiredInputs: []
              });
              // Clear selected tools to use default chat behavior
              setSelectedTools([]);
            } else {
              // For specialized agents, find the matching tool
              const matchingTool = availableTools.find(tool => tool.id === detectedAgent.agentId);
              if (matchingTool) {
                // Update the thread with the detected agent
                updateThreadAgentSelection(activeThreadId, detectedAgent);
                // Set the selected tool based on the detected agent
                setSelectedTools([matchingTool]);
                
                // Immediately use the detected tool
                await handleToolSelection({
                  content,
                  selectedTools: [matchingTool],
                  activeThreadId,
                  updatedMessages,
                  messages,
                  userMessage,
                  updateThreadMessages,
                  setIsStreaming,
                  setStreamingContent,
                  setToolUsed
                });
                
                // Return early since we've already handled the message
                return;
              }
            }
          }
        } catch (error) {
          console.error('Error detecting agent:', error);
        } finally {
          setIsDetectingAgent(false);
        }
      }
      
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
      // If tools are selected, use them
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
          setToolUsed
        });
      } 
      // If no tool is selected and tools haven't been used yet
      else {
        setIsStreaming(true);
        setStreamingContent('');
        const detectedToolToUse = availableTools.find(tool => tool.id === 'chat');
        if (detectedToolToUse) {
          console.log(`Using detected tool: ${detectedToolToUse.id}`);
          // Call the tool-specific API
          const apiResponse = await callToolSpecificApi(content, detectedToolToUse, activeThreadId);
          
          // Create an assistant message with the API response
          const assistantMessageId = uuidv4();
          const assistantMessage: Message = {
            id: assistantMessageId,
            content: apiResponse.content,
            role: 'assistant',
            timestamp: new Date(),
            toolResults: apiResponse.toolResults
          };
          
          // Add the assistant message to the thread
          const finalMessages = [...updatedMessages, assistantMessage];
          updateThreadMessages(activeThreadId, finalMessages);
          
          // If there are tool results, open the detail panel
          if (apiResponse.toolResults && apiResponse.toolResults.length > 0) {
            openDetailPanel(apiResponse.toolResults[0].result);
            setToolUsed(true);
          }
        } else {
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
          // Update the thread with the manually selected agent
          if (activeThreadId) {
            updateThreadAgentSelection(activeThreadId, {
              agentId: toolId,
              reason: 'Manually selected by user',
              status: 'overridden'
            });
          }
          return [toolToAdd];
        }
        return [];
      }
    });
  }, [availableTools, toolUsed, activeThreadId, updateThreadAgentSelection]);

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
    isAutoDetectAgent,
    isDetectingAgent,
    sendMessage,
    toggleTool,
    clearChat,
    toggleMockData,
    createThread,
    selectThread,
    deleteThread,
    openDetailPanel,
    closeDetailPanel,
    setIsAutoDetectAgent,
  };
};
