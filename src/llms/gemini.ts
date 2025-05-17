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
and ethical considerations in financial transactions. Be concise, accurate, and helpful.

For general questions or greetings that are not specifically about Islamic finance, respond in a friendly, conversational manner while maintaining your expertise. You can engage in small talk while being ready to provide expert assistance when needed.`;

const AGENT_ROUTER_SYSTEM_PROMPT = `You are a system routing user queries to the most appropriate expert agent in an Islamic finance AI system.

Each agent handles a specific type of task:

###  Journal Entry Generator (Use Case Scenarios)
This agent receives detailed Islamic finance transaction scenarios (e.g., lease agreements, profit-sharing deals) and generates the correct journal entries in compliance with AAOIFI standards. It explains accounting treatments like asset recognition, amortization, or profit distribution.

Use this agent when the query contains narrative transaction descriptions needing accounting output.

---

### Reverse Accounting Logic (Reverse Transactions)
This agent is given journal entries (without narrative context) and must reverse-engineer what kind of transaction occurred. It identifies the applicable AAOIFI standards and explains why.

Use this agent when the query involves unexplained or ambiguous journal entries and asks what they mean.

---

### Compliance Checker
This agent scans financial reports or text documents for violations or inconsistencies with AAOIFI standards. It returns compliance analysis and flags issues.

Use this agent when the query asks whether a document or report is Shariah-compliant or adheres to AAOIFI standards.

---

###  Product Design Advisor
This agent helps users design new Islamic finance products. It recommends contract types (e.g., Murabaha, Musharaka), maps them to relevant FAS standards, and outlines Shariah concerns.

Your task is to analyze the user's query and determine which agent would be most appropriate to handle it.`;

const SUMMARIZER_SYSTEM_PROMPT = `Your task is to summarize complex financial information 
related to Islamic finance. Extract the key points, highlight important financial principles, 
and ensure the summary is accurate and concise. Focus on the most relevant information for 
Islamic finance practitioners and students. Your summary should be clear, structured, and 
retain all critical financial details while being easy to understand.`;

// Chat model configuration - keeping it simple to avoid TypeScript errors
export const getChatModel = () => {
  return {
    model: 'gemini-2.5-flash-preview-04-17',
    config: { 
      systemInstruction: CHAT_SYSTEM_PROMPT
    }
  };
};

// Agent router model for determining the appropriate agent
export const getAgentRouterModel = () => {
  return {
    model: 'gemini-2.5-flash-preview-04-17',
    config: { 
      systemInstruction: AGENT_ROUTER_SYSTEM_PROMPT
    }
  };
};

// Summarizer model for processing API responses
export const getSummarizerModel = () => {
  return {
    model: 'gemini-2.5-flash-preview-04-17',
    config: { systemInstruction: SUMMARIZER_SYSTEM_PROMPT }
  };
};

// Define the agent detection response type
export interface AgentDetectionResult {
  agentId: string;
  reason: string;
  requiredInputs?: string[];
  status: 'suggested' | 'confirmed' | 'overridden';
}

// Function to detect the appropriate agent based on user query
// Generic function to extract structured data from natural language using LLM
export const extractStructuredDataWithLLM = async (
  userInput: string,
  agentType: string,
  chatHistory: Array<{ role: string; parts: string }> = []
): Promise<any> => {
  try {
    // Use the same model as the agent router but with a different prompt
    const modelConfig = getAgentRouterModel();
    
    // Create a base context from chat history if available
    let contextFromHistory = '';
    if (chatHistory && chatHistory.length > 0) {
      contextFromHistory = 'Previous conversation context:\n' + 
        chatHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n') + '\n\n';
    }
    
    // Select the appropriate prompt based on agent type
    let prompt = '';
    
    if (agentType === 'product-design') {
      prompt = `
        ${contextFromHistory}
        Extract structured information for an Islamic financial product design from the following user input.
        
        User input: "${userInput}"
        
        Extract the following fields (if present):
        - product_objective: The main goal or purpose of the product
        - risk_appetite: The level of risk tolerance (e.g., low, medium, high)
        - investment_tenor: The time period or duration of the investment
        - target_audience: The intended users or customers for this product
        - asset_focus: The specific asset class or focus (if mentioned)
        - desired_features: List of features the product should have
        - specific_exclusions: List of things to exclude from the product
        - additional_notes: Any other relevant information
        
        If any field is not mentioned in the input, leave it empty for strings or as an empty array for lists.
        For desired_features and specific_exclusions, these should be arrays of strings.
        
        Format your response as a valid JSON object with these fields. Do not include any explanations or text outside the JSON object.
        Example format:
        {
          "product_objective": "string",
          "risk_appetite": "string",
          "investment_tenor": "string",
          "target_audience": "string",
          "asset_focus": "string",
          "desired_features": ["string", "string"],
          "specific_exclusions": ["string", "string"],
          "additional_notes": "string"
        }
      `;
    } else if (agentType === 'compliance-verification') {
      prompt = `
        ${contextFromHistory}
        Extract structured information for Islamic finance compliance verification from the following user input.
        
        User input: "${userInput}"
        
        Extract the following fields (if present):
        - document_content: The text content of the document to be verified for compliance
        - document_name: The name or title of the document (if mentioned)
        - specific_standards: Any specific AAOIFI standards mentioned to check against
        - focus_areas: Specific areas or sections to focus on during verification
        
        If any field is not mentioned in the input, leave it empty for strings or as an empty array for lists.
        For specific_standards and focus_areas, these should be arrays of strings.
        
        Format your response as a valid JSON object with these fields. Do not include any explanations or text outside the JSON object.
        Example format:
        {
          "document_content": "string",
          "document_name": "string",
          "specific_standards": ["string", "string"],
          "focus_areas": ["string", "string"]
        }
      `;
    } else {
      // Default generic extraction prompt
      prompt = `
        ${contextFromHistory}
        Extract structured information from the following user input for the ${agentType} agent.
        
        User input: "${userInput}"
        
        Analyze the input and extract all relevant information into a structured JSON format.
        If you're unsure about any fields, make your best guess based on the context.
        
        Format your response as a valid JSON object. Do not include any explanations or text outside the JSON object.
      `;
    }
    
    const response = await ai.models.generateContent({
      model: modelConfig.model,
      contents: prompt,
      config: {
        ...modelConfig.config,
        temperature: 0.1 // Lower temperature for more deterministic extraction
      },
    });
    
    console.log(`LLM extraction for ${agentType} - Raw response:`, response.text);
    
    if (response.text) {
      try {
        // Extract JSON from the response
        const jsonMatch = response.text.match(/\{[\s\S]*\}/); 
        if (jsonMatch) {
          console.log(`LLM extraction for ${agentType} - JSON match found:`, jsonMatch[0]);
          
          const extractedData = JSON.parse(jsonMatch[0]);
          console.log(`LLM extraction for ${agentType} - Parsed data:`, extractedData);
          
          // Process based on agent type
          if (agentType === 'product-design') {
            // Provide default values for required fields if missing
            const defaultProductDesignData = {
              product_objective: '',
              risk_appetite: '',
              investment_tenor: '',
              target_audience: '',
              asset_focus: '',
              desired_features: [],
              specific_exclusions: [],
              additional_notes: userInput
            };
            
            // Merge with defaults to ensure all fields exist
            extractedData.product_objective = extractedData.product_objective || defaultProductDesignData.product_objective;
            extractedData.risk_appetite = extractedData.risk_appetite || defaultProductDesignData.risk_appetite;
            extractedData.investment_tenor = extractedData.investment_tenor || defaultProductDesignData.investment_tenor;
            extractedData.target_audience = extractedData.target_audience || defaultProductDesignData.target_audience;
            extractedData.asset_focus = extractedData.asset_focus || defaultProductDesignData.asset_focus;
            extractedData.additional_notes = extractedData.additional_notes || defaultProductDesignData.additional_notes;
            
            // Ensure arrays are properly formatted
            if (!Array.isArray(extractedData.desired_features)) {
              extractedData.desired_features = extractedData.desired_features ? 
                [extractedData.desired_features] : [];
            }
            
            if (!Array.isArray(extractedData.specific_exclusions)) {
              extractedData.specific_exclusions = extractedData.specific_exclusions ? 
                [extractedData.specific_exclusions] : [];
            }
            
            // If arrays are empty, try to extract from additional_notes as a fallback
            if (extractedData.desired_features.length === 0 && extractedData.additional_notes) {
              extractedData.desired_features = ['Shariah compliance']; // Default feature
            }
            
            if (extractedData.specific_exclusions.length === 0) {
              extractedData.specific_exclusions = ['None specified']; // Default exclusion
            }
          } else if (agentType === 'compliance-verification') {
            // Provide default values
            extractedData.document_content = extractedData.document_content || userInput;
            extractedData.document_name = extractedData.document_name || 'Unnamed Document';
            
            // Ensure arrays are properly formatted
            if (!Array.isArray(extractedData.specific_standards)) {
              extractedData.specific_standards = extractedData.specific_standards ? 
                [extractedData.specific_standards] : [];
            }
            
            if (!Array.isArray(extractedData.focus_areas)) {
              extractedData.focus_areas = extractedData.focus_areas ? 
                [extractedData.focus_areas] : [];
            }
          }
          
          console.log(`LLM extraction for ${agentType} - Final processed data:`, extractedData);
          return extractedData;
        } else {
          console.error(`LLM extraction for ${agentType} - No JSON found in response`);
        }
      } catch (e) {
        console.error(`Error parsing LLM extraction response for ${agentType}:`, e);
        console.log('Full response text:', response.text);
      }
    } else {
      console.error(`LLM extraction for ${agentType} - Empty response`);
    }
    
    // Return a default structure based on agent type
    if (agentType === 'product-design') {
      return {
        product_objective: '',
        risk_appetite: '',
        investment_tenor: '',
        target_audience: '',
        asset_focus: '',
        desired_features: [],
        specific_exclusions: [],
        additional_notes: userInput
      };
    } else if (agentType === 'compliance-verification') {
      return {
        document_content: userInput,
        document_name: '',
        specific_standards: [],
        focus_areas: []
      };
    } else {
      // Generic fallback
      return { content: userInput };
    }
  } catch (error) {
    console.error(`Error extracting data with LLM for ${agentType}:`, error);
    throw error;
  }
};

// Function to extract product design data from natural language using LLM
export const extractProductDesignDataWithLLM = async (
  userInput: string,
  chatHistory: Array<{ role: string; parts: string }> = []
): Promise<any> => {
  // Use the generic function with product-design agent type
  return extractStructuredDataWithLLM(userInput, 'product-design', chatHistory);
};

// Function to extract compliance verification data from natural language using LLM
export const extractComplianceVerificationDataWithLLM = async (
  userInput: string,
  chatHistory: Array<{ role: string; parts: string }> = []
): Promise<any> => {
  // Use the generic function with compliance-verification agent type
  return extractStructuredDataWithLLM(userInput, 'compliance-verification', chatHistory);
};

export const detectAgent = async (
  userMessage: string
): Promise<AgentDetectionResult | null> => {
  try {
    const modelConfig = getAgentRouterModel();
    
    // Use a structured prompt to get the agent selection
    const prompt = `
      Based on the user's query, select the most appropriate agent to handle it.
      Available agents:
      1. journaling - Journal Entry Generator for detailed Islamic finance transaction scenarios
      2. analyzer - Reverse Accounting Logic for analyzing journal entries
      3. compliance-verification - Compliance Checker for verifying AAOIFI standards compliance
      4. product-design - Product Design Advisor for designing Islamic finance products
      5. chat - Default conversational agent for general questions and interactions
      
      IMPORTANT: 
      - Only select a specialized agent (1-4) if the query CLEARLY relates to that agent's specific function
      - For general questions, chat, greetings, or any message not specifically related to agents 1-4, ALWAYS select the chat agent
      - The chat agent is the DEFAULT option and should be used whenever there's uncertainty
      
      User query: "${userMessage}"
      
      Respond in JSON format only, with the following structure:
      {
        "agentId": "[one of: journaling, analyzer, compliance-verification, product-design, chat]",
        "reason": "[brief explanation of why this agent was selected]",
        "requiredInputs": ["list of specific required inputs that might be missing from the user query"]
      }
      
      For requiredInputs, be specific about what information is needed. For example:
      - For journaling: transaction details, amounts, parties involved, etc.
      - For analyzer: specific journal entries to analyze, accounting standards to check against
      - For compliance-verification: document content to verify, specific standards to check
      - For product-design: product objectives, risk appetite, target audience, etc.
    `;
    
    const response = await ai.models.generateContent({
      model: modelConfig.model,
      contents: prompt,
      config: modelConfig.config,
    });
    
    if (response.text) {
      try {
        // Extract JSON from the response
        const jsonMatch = response.text.match(/\{[\s\S]*\}/); 
        if (jsonMatch) {
          const jsonResponse = JSON.parse(jsonMatch[0]);
          
          // Avoid selecting journaling as default
          if (jsonResponse.agentId === 'journaling' && 
              (!jsonResponse.reason || jsonResponse.reason.toLowerCase().includes('default') || 
               jsonResponse.reason.toLowerCase().includes('unclear'))) {
            // Fall back to analyzer if journaling was selected as a default
            return {
              agentId: 'analyzer',
              reason: 'Selected as a more general-purpose agent when the query intent is unclear',
              requiredInputs: [],
              status: 'suggested'
            };
          }
          
          return {
            agentId: jsonResponse.agentId,
            reason: jsonResponse.reason,
            requiredInputs: jsonResponse.requiredInputs || [],
            status: 'suggested'
          };
        }
      } catch (e) {
        console.error('Error parsing agent detection response:', e);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting agent:', error);
    return null;
  }
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
