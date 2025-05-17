import { Message } from '../../types/chat';
import { generateContentStream, summarizeApiResponse } from '../../llms/gemini';

/**
 * Handles streaming content from Gemini API
 * @param userMessage The user message that triggered the streaming
 * @param chatHistory Previous chat history in Gemini format
 * @param assistantMessage The placeholder assistant message to update
 * @param updateCallback Callback to update messages during streaming
 * @returns The final content after streaming completes
 */
export const handleGeminiStreaming = async (
  userMessage: Message,
  chatHistory: any[],
  assistantMessage: Message,
  updateCallback: (updatedMessage: Message) => void
): Promise<string> => {
  // Get streaming response
  const streamingResponse = await generateContentStream([userMessage], chatHistory);
  
  // Process the stream
  let fullContent = '';
  
  for await (const chunk of streamingResponse.stream) {
    if (chunk.text) {
      fullContent += chunk.text;
      
      // Update the message with the current content
      const updatedAssistantMessage = {
        ...assistantMessage,
        content: fullContent,
      };
      
      updateCallback(updatedAssistantMessage);
    }
  }
  
  return fullContent;
};

/**
 * Handles streaming content for API response summarization
 * @param apiResponseContent The API response content to summarize
 * @param userQuery The original user query for context
 * @param placeholderMessage The placeholder message to update during streaming
 * @param updateCallback Callback to update messages during streaming
 * @returns The final summary text
 */
export const handleSummaryStreaming = async (
  apiResponseContent: string | object,
  userQuery: string,
  placeholderMessage: Message,
  updateCallback: (updatedMessage: Message) => void
): Promise<string> => {
  // Convert object to string if needed
  const contentToSummarize = typeof apiResponseContent === 'string' 
    ? apiResponseContent 
    : JSON.stringify(apiResponseContent);
  
  // Start summarizing the API response
  const summaryStream = await summarizeApiResponse(
    contentToSummarize,
    userQuery // Original user query as context
  );
  
  let summaryText = '';
  
  // Process the streaming summary
  for await (const chunk of summaryStream) {
    if (chunk.text) {
      summaryText += chunk.text;
      
      // Update the placeholder message with the current summary
      const updatedPlaceholder = {
        ...placeholderMessage,
        content: summaryText
      };
      
      updateCallback(updatedPlaceholder);
    }
  }
  
  return summaryText;
};
