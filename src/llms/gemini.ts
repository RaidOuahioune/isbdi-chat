import { GoogleGenAI } from '@google/genai';

// Environment variables should be loaded from .env file
const GEMINI_API_KEY = 'AIzaSyCxOWqwcHGPh8R8QK6407oxWUMHgsoRhK0';

// Initialize the Google Generative AI client
const ai = new GoogleGenAI({ vertexai: false, apiKey: GEMINI_API_KEY });

// System prompts
const CHAT_SYSTEM_PROMPT = `You are an expert assistant in Islamic finance. 
Your role is to provide accurate, helpful information about Islamic financial principles, 
products, and practices. Focus on explaining concepts like Murabaha, Ijara, Sukuk, 
Musharaka, and other Islamic financial instruments. Provide guidance on Shariah compliance 
and ethical considerations in financial transactions. Be concise, accurate, and helpful.`;

const SUMMARIZER_SYSTEM_PROMPT = `Your task is to summarize complex financial information 
related to Islamic finance. Extract the key points, highlight important financial principles, 
and ensure the summary is accurate and concise. Focus on the most relevant information for 
Islamic finance practitioners and students. Your summary should be clear, structured, and 
retain all critical financial details while being easy to understand.`;

// Chat model for direct conversations
export const getChatModel = () => {
  return {
    model: 'gemini-2.5-flash-preview-04-17',
    config: { systemInstruction: CHAT_SYSTEM_PROMPT }
  };
};

// Summarizer model for processing API responses
export const getSummarizerModel = () => {
  return {
    model: 'gemini-2.5-flash-preview-04-17',
    config: { systemInstruction: SUMMARIZER_SYSTEM_PROMPT }
  };
};

// Function to generate chat response
export const generateChatResponse = async (
  messages: Array<{ role: string; content: string }>,
  history: Array<{ role: string; parts: string }>
) => {
  try {
    const modelConfig = getChatModel();
    const latestMessage = messages[messages.length - 1];
    
    // Include history in the context if available
    let contextContent = latestMessage.content;
    if (history && history.length > 0) {
      // Format history as context for the model
      const historyContext = history
        .map(item => `${item.role}: ${item.parts}`)
        .join('\n');
      contextContent = `${historyContext}\n\nUser: ${latestMessage.content}`;
    }
    
    const response = await ai.models.generateContent({
      model: modelConfig.model,
      contents: contextContent,
      config: modelConfig.config,
    });
    
    return {
      id: Date.now().toString(),
      content: response.text || '',
      role: 'assistant',
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};

// Function to summarize API response
export const summarizeApiResponse = async (
  apiResponse: string,
  context?: string
) => {
  try {
    const modelConfig = getSummarizerModel();
    const prompt = `
      Summarize the following API response related to Islamic finance:
      
      ${apiResponse}
      ${context ? `\nAdditional context: ${context}` : ''}
    `;
    
    // Create a mock stream to maintain compatibility with the existing code
    const mockStream = {
      async *[Symbol.asyncIterator]() {
        const response = await ai.models.generateContent({
          model: modelConfig.model,
          contents: prompt,
          config: modelConfig.config,
        });
        
        // Yield the entire response as a single chunk
        yield { text: response.text || '' };
      }
    };
    
    return mockStream;
  } catch (error) {
    console.error('Error summarizing API response:', error);
    throw error;
  }
};

// Function to generate streaming content from Gemini
export const generateContentStream = async (
  messages: Array<{ role: string; content: string }>,
  history: Array<{ role: string; parts: string }>
) => {
  try {
    const modelConfig = getChatModel();
    const latestMessage = messages[messages.length - 1];
    
    // Include history in the context if available
    let contextContent = latestMessage.content;
    if (history && history.length > 0) {
      // Format history as context for the model
      const historyContext = history
        .map(item => `${item.role}: ${item.parts}`)
        .join('\n');
      contextContent = `${historyContext}\n\nUser: ${latestMessage.content}`;
    }
    
    // Use the streaming API
    const result = await ai.models.generateContentStream({
      model: modelConfig.model,
      contents: contextContent,
      config: modelConfig.config,
    });
    
    return {
      id: Date.now().toString(),
      stream: result,
      role: 'assistant',
    };
  } catch (error) {
    console.error('Error generating streaming response:', error);
    throw error;
  }
};
