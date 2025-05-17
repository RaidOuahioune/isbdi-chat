import { Message } from '../../types/chat';
import { generateContentStream, summarizeApiResponse } from '../../llms/gemini';
import { createAssistantMessage } from './threadMessageUtils';

/**
 * Handles the streaming process for a Gemini chat response
 * @param userMessage The user message that triggered the response
 * @param messages Current messages array
 * @param updateThreadMessages Function to update thread messages
 * @param threadId Current thread ID
 * @param setIsStreaming State setter for streaming flag
 * @param setStreamingContent State setter for streaming content
 * @param getGeminiHistory Function to convert messages to Gemini format
 */
export const handleGeminiChatStreaming = async (
  userMessage: Message,
  messages: Message[],
  updateThreadMessages: (threadId: string, messages: Message[]) => void,
  threadId: string,
  setIsStreaming: (value: boolean) => void,
  setStreamingContent: (value: string) => void,
  getGeminiHistory: (messages: Message[]) => any[]
) => {
  // Get chat history in Gemini format
  const chatHistory = getGeminiHistory(messages);
  
  // Create a placeholder message for streaming
  const assistantMessage = createAssistantMessage('');
  
  // Add the placeholder message to the thread
  const updatedMessages = [...messages, userMessage];
  const messagesWithPlaceholder = [...updatedMessages, assistantMessage];
  updateThreadMessages(threadId, messagesWithPlaceholder);
  
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
        updateThreadMessages(threadId, streamingMessages);
      }
    }
    
    // Final update with complete content
    const finalAssistantMessage = {
      ...assistantMessage,
      content: fullContent,
    };
    
    const finalMessages = [...updatedMessages, finalAssistantMessage];
    updateThreadMessages(threadId, finalMessages);
    
    return { success: true, content: fullContent };
  } catch (error) {
    console.error('Error in streaming response:', error);
    throw error; // Let the outer catch block handle this
  } finally {
    setIsStreaming(false);
  }
};

/**
 * Handles the streaming process for a tool API response summary
 * @param userMessage The user message that triggered the response
 * @param apiResponse The API response to summarize
 * @param messages Current messages array
 * @param updateThreadMessages Function to update thread messages
 * @param threadId Current thread ID
 * @param setIsStreaming State setter for streaming flag
 * @param setStreamingContent State setter for streaming content
 * @param setToolUsed Function to set tool used flag
 * @param openDetailPanel Function to open detail panel
 * @param selectedTool The selected tool that was used
 */
export const handleToolResponseStreaming = async (
  userMessage: Message,
  apiResponse: any,
  messages: Message[],
  updateThreadMessages: (threadId: string, messages: Message[]) => void,
  threadId: string,
  setIsStreaming: (value: boolean) => void,
  setStreamingContent: (value: string) => void,
  setToolUsed: (value: boolean) => void,
  selectedTool: any
) => {
  // Store the API response data in the message for later use in the detail panel
  // But don't automatically open the panel
  
  // Start streaming the summary
  setIsStreaming(true);
  setStreamingContent('');
  
  // Create a placeholder message that will be updated with streaming content
  const placeholderMessage = createAssistantMessage('', []);
  placeholderMessage.isStreaming = true;
  
  const updatedMessages = [...messages, userMessage];
  const messagesWithPlaceholder = [...updatedMessages, placeholderMessage];
  updateThreadMessages(threadId, messagesWithPlaceholder);
  
  // Start summarizing the API response
  const contentToSummarize = typeof apiResponse.content === 'string' 
    ? apiResponse.content 
    : JSON.stringify(apiResponse.content);
  
  const summaryStream = await summarizeApiResponse(
    contentToSummarize,
    userMessage.content // Original user query as context
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
      
      const messagesWithUpdatedPlaceholder = [...updatedMessages, updatedPlaceholder];
      updateThreadMessages(threadId, messagesWithUpdatedPlaceholder);
    }
  }
  
  // Create the final message with the complete summary
  const assistantMessage: Message = {
    id: apiResponse.id || placeholderMessage.id,
    content: summaryText,
    role: 'assistant',
    timestamp: new Date(),
    toolResults: [{
      id: apiResponse.toolResults?.[0]?.id || placeholderMessage.id,
      toolName: selectedTool.name,
      result: apiResponse.toolResults?.[0]?.result || apiResponse.content
    }]
  };
  
  const finalMessages = [...updatedMessages, assistantMessage];
  updateThreadMessages(threadId, finalMessages);
  
  // Mark that a tool has been used in this thread
  setToolUsed(true);
  setIsStreaming(false);
  
  return { success: true, content: summaryText };
};
