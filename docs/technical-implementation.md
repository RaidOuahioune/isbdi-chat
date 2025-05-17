# Technical Implementation

## Overview

This document provides a detailed technical overview of the ISBDI Chat System implementation, focusing on the core components, their interactions, and the key technologies used.

## Core Components Implementation

### 1. Chat ViewModel (`useChatViewModel.ts`)

The Chat ViewModel serves as the central controller for the application, managing state and business logic.

**Key Responsibilities:**
- Thread management (creation, selection, deletion)
- Message processing and routing
- Agent detection and selection
- Tool selection and processing
- Streaming response handling

**Implementation Highlights:**
```typescript
// Main hook that provides chat functionality
export function useChatViewModel(): ChatViewModel {
  // State management
  const [threads, setThreads] = useState<Thread[]>([createInitialThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [toolUsed, setToolUsed] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isAutoDetectAgent, setIsAutoDetectAgent] = useState<boolean>(true);
  const [isDetectingAgent, setIsDetectingAgent] = useState<boolean>(false);
  const [pendingAgentSelection, setPendingAgentSelection] = useState<AgentSelection | null>(null);

  // Message processing function
  const sendMessage = useCallback(async (content: string) => {
    // Message processing logic
    // Agent detection
    // Tool selection and processing
    // Response generation
  }, [/* dependencies */]);

  // Return interface for components
  return {
    messages,
    isLoading,
    selectedTools,
    availableTools,
    threads,
    activeThreadId,
    detailPanelContent,
    isDetailPanelOpen,
    toolUsed,
    isStreaming,
    streamingContent,
    isAutoDetectAgent,
    isDetectingAgent,
    pendingAgentSelection,
    sendMessage,
    toggleTool,
    clearChat,
    createThread,
    selectThread,
    deleteThread,
    openDetailPanel,
    closeDetailPanel,
    setIsAutoDetectAgent,
  };
}
```

### 2. LLM Service (`gemini.ts`)

The LLM Service provides natural language understanding and generation capabilities using Google's Gemini API.

**Key Functions:**
- Agent detection
- Chat response generation
- Content streaming
- API response summarization

**Implementation Highlights:**
```typescript
// Agent detection function
export const detectAgent = async (
  userMessage: string
): Promise<AgentDetectionResult | null> => {
  try {
    const modelConfig = getAgentRouterModel();
    
    // Prepare prompt for agent detection
    const prompt = `
      User Query: ${userMessage}
      
      Based on this query, determine which agent would be most appropriate to handle it.
      Respond in JSON format with the following structure:
      {
        "agentId": "journaling|analyzer|compliance-checker|product-design",
        "reason": "Brief explanation of why this agent is appropriate",
        "requiredInputs": ["list", "of", "required", "fields"]
      }
    `;
    
    // Call Gemini API
    const response = await ai.models.generateContent({
      model: modelConfig.model,
      contents: prompt,
      config: modelConfig.config,
    });
    
    // Process response
    // Return agent detection result
  } catch (error) {
    console.error('Error detecting agent:', error);
    return null;
  }
};

// Streaming content generation
export const generateContentStream = async (
  messages: Array<{ role: string; content: string }>,
  history: Array<{ role: string; parts: string }>
) => {
  // Implementation of streaming content generation
};
```

### 3. Tool API (`toolApi.ts`)

The Tool API interfaces with specialized backend services for domain-specific tasks in Islamic finance.

**Key Functions:**
- Tool-specific API calls
- Payload validation
- Error handling
- Result formatting

**Implementation Highlights:**
```typescript
// Handle tool-specific API calls
export const callToolSpecificApi = async (content: string, tool: Tool, activeThreadId: string | null) => {
  try {
    // Based on the selected tool, call the appropriate API endpoint
    switch (tool.id) {
      case 'journaling': {
        // Process use case with the journaling tool
        const useCaseResponse = await api.processUseCase({
          scenario: content
        });
        return {
          id: uuidv4(),
          content: useCaseResponse.accounting_guidance,
          toolResults: [{
            id: uuidv4(),
            toolName: 'Journaling',
            result: `Scenario: ${useCaseResponse.scenario}\nGuidance: ${useCaseResponse.accounting_guidance}`
          }]
        };
      }
      
      case 'product-design': {
        // Handle product design tool with LLM extraction if needed
        // Validate required fields
        // Call API and format response
      }
      
      // Other tool implementations...
    }
  } catch (error) {
    // Error handling
  }
};
```

### 4. Required Fields Validation (`requiredFieldsValidator.ts`)

Ensures that all necessary information is provided before calling specialized tools.

**Key Functions:**
- Field validation
- System prompt generation
- Validation message processing

**Implementation Highlights:**
```typescript
// Validate required fields for a tool
export function validateRequiredFields(
  content: string,
  requiredFields: string[],
  toolId: string
): { isValid: boolean; missingFields: string[] } {
  // Validation logic
}

// Create system prompt for field validation
export function createSystemPromptMessage(
  missingFields: string[],
  toolId: string
): Message {
  // Create prompt requesting missing information
}
```

## Key Interactions Implementation

### 1. Agent Detection and Selection

```typescript
// In useChatViewModel.ts
const detectAndSelectAgent = async (userMessage: Message) => {
  setIsDetectingAgent(true);
  
  try {
    // Call agent detection
    const agentDetection = await detectAgent(userMessage.content);
    
    if (agentDetection) {
      // Set pending agent selection
      setPendingAgentSelection(agentDetection);
      
      // Find the corresponding tool
      const detectedTool = availableTools.find(tool => tool.id === agentDetection.agentId);
      
      if (detectedTool) {
        // Set selected tool
        setSelectedTools([detectedTool]);
        
        // Update thread with agent selection
        if (activeThreadId) {
          updateThreadAgentSelection(activeThreadId, agentDetection);
        }
      }
    }
  } catch (error) {
    console.error('Error detecting agent:', error);
  } finally {
    setIsDetectingAgent(false);
  }
};
```

### 2. Streaming Response Handling

```typescript
// In useChatViewModel.ts
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
    throw error;
  } finally {
    setIsStreaming(false);
  }
}
```

### 3. Tool Processing

```typescript
// In toolApi.ts
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
    
    // Create assistant message with tool results
    const assistantMessage: Message = {
      id: apiResponse.id,
      content: apiResponse.content,
      role: 'assistant',
      timestamp: new Date(),
      toolResults: apiResponse.toolResults,
    };
    
    // Update thread with the new message
    const finalMessages = [...updatedMessages, assistantMessage];
    updateThreadMessages(activeThreadId, finalMessages);
    
    // Set tool as used for this thread
    setToolUsed(true);
    
    // If the response includes a summary, stream it
    if (apiResponse.summary) {
      setIsStreaming(true);
      setStreamingContent('');
      
      try {
        const summaryStream = await summarizeApiResponse(
          JSON.stringify(apiResponse.toolResults[0].result),
          `This is a response from the ${selectedTool.name} tool.`
        );
        
        let summaryContent = '';
        for await (const chunk of summaryStream) {
          summaryContent += chunk.text || '';
          setStreamingContent(summaryContent);
        }
        
        // Update the message with the summary
        const updatedMessage = {
          ...assistantMessage,
          content: summaryContent,
        };
        
        const messagesWithSummary = [...updatedMessages, updatedMessage];
        updateThreadMessages(activeThreadId, messagesWithSummary);
      } catch (error) {
        console.error('Error generating summary:', error);
      } finally {
        setIsStreaming(false);
      }
    }
  } catch (error) {
    console.error(`Error processing with ${selectedTool.name}:`, error);
    throw error;
  }
}
```

## Data Flow Implementation

### 1. Message Processing Flow

```typescript
// In useChatViewModel.ts
const sendMessage = useCallback(async (content: string) => {
  if (isLoading || content.trim() === '') return;
  
  setIsLoading(true);
  
  try {
    // Create user message
    const userMessage = createUserMessage(content);
    
    // Get current thread messages
    const currentThread = threads.find(t => t.id === activeThreadId);
    const messages = currentThread?.messages || [];
    
    // Add user message to thread
    const updatedMessages = [...messages, userMessage];
    updateThreadMessages(activeThreadId, updatedMessages);
    
    // Check if we need to validate required fields
    if (messages.length > 0 && isResponseToSystemPrompt(messages[messages.length - 1])) {
      // Process response to system prompt for required fields
      // ...
    } else {
      // Normal message processing
      
      // Auto-detect agent if enabled and no tool used yet
      if (isAutoDetectAgent && !toolUsed && selectedTools.length === 0) {
        await detectAndSelectAgent(userMessage);
      }
      
      // Process with selected tool or default chat
      if (selectedTools.length > 0) {
        await handleToolSelection({
          content,
          selectedTools,
          activeThreadId,
          updatedMessages,
          updateThreadMessages,
          setIsStreaming,
          setStreamingContent,
          setToolUsed,
          messages,
          userMessage
        });
      } else {
        // Use default chat with streaming
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
    // Error handling
  } finally {
    setIsLoading(false);
    setIsStreaming(false);
  }
}, [/* dependencies */]);
```

### 2. Thread Management Flow

```typescript
// In useChatViewModel.ts
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
```

## Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Strongly typed programming language
- **Axios**: HTTP client for API requests

### Backend
- **RESTful APIs**: Specialized endpoints for different Islamic finance tasks
- **Microservices Architecture**: Separate services for different agent functionalities

### AI/ML
- **Google Gemini API**: Large language model for natural language understanding and generation
- **Streaming API**: Real-time response generation and display

### State Management
- **React Hooks**: Local state management using useState and useCallback
- **Custom Hooks**: Encapsulated business logic in reusable hooks
