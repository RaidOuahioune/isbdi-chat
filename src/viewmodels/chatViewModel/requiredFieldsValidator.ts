import { AgentDetectionResult } from '../../llms/gemini';
import { Message } from '../../types/chat';

/**
 * Interface for validation result
 */
export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  promptMessage?: string;
}

/**
 * Validates if all required fields are present for an agent
 * @param agentResult The detected agent result
 * @param userMessage The user's message content
 * @returns Validation result with missing fields and prompt message if any
 */
export const validateRequiredFields = (
  agentResult: AgentDetectionResult,
  userMessage: string
): ValidationResult => {
  // If there are no required inputs or the array is empty, it's valid
  if (!agentResult.requiredInputs || agentResult.requiredInputs.length === 0) {
    return { isValid: true, missingFields: [] };
  }

  // Check each required field against the user message
  const missingFields = agentResult.requiredInputs.filter(field => {
    // Simple check if the field name appears in the message
    // This is a basic implementation - a more sophisticated approach would use NLP
    return !userMessage.toLowerCase().includes(field.toLowerCase());
  });

  // If there are no missing fields, it's valid
  if (missingFields.length === 0) {
    return { isValid: true, missingFields: [] };
  }

  // Create a prompt message for the user
  const promptMessage = createPromptMessage(agentResult.agentId, missingFields);

  return {
    isValid: false,
    missingFields,
    promptMessage
  };
};

/**
 * Creates a prompt message for the user to provide missing fields
 * @param agentId The ID of the agent
 * @param missingFields Array of missing field names
 * @returns A formatted prompt message
 */
const createPromptMessage = (agentId: string, missingFields: string[]): string => {
  // Customize the message based on the agent type
  let additionalContext = '';

  switch (agentId) {
    case 'product-design':
      additionalContext = 'to design your Islamic finance product';
      break;
    case 'compliance-verification':
      additionalContext = 'to verify compliance with AAOIFI standards';
      break;
    case 'journaling':
      additionalContext = 'to generate the correct journal entries';
      break;
    case 'analyzer':
      additionalContext = 'to analyze these journal entries';
      break;
    default:
      additionalContext = '';
  }

  // Format the list of missing fields
  const fieldsList = missingFields.map(field => `• ${field}`).join('\n');

  return `I need more information ${additionalContext}. Please provide the following details:

${fieldsList}

Once you provide this information, I'll be able to assist you more effectively.`;
};

/**
 * Creates a system message to prompt the user for missing fields
 * @param validationResult The validation result containing missing fields
 * @returns A system message object
 */
export const createSystemPromptMessage = (validationResult: ValidationResult): Message => {
  return {
    id: `system-prompt-${Date.now()}`,
    content: validationResult.promptMessage || 'Please provide more information.',
    role: 'assistant',
    timestamp: new Date(),
    isSystemPrompt: true
  };
};

/**
 * Checks if a message is a response to a system prompt for missing fields
 * @param messages Array of messages in the conversation
 * @returns Boolean indicating if this is a response to a system prompt
 */
export const isResponseToSystemPrompt = (messages: Message[]): boolean => {
  if (messages.length === 0) return false;
  
  // Check if the last message was a system prompt
  const lastMessage = messages[messages.length - 1];
  return !!lastMessage.isSystemPrompt;
};

/**
 * Combines the current message with previous messages to extract all provided fields
 * @param messages Array of messages in the conversation
 * @param currentMessage The current user message
 * @returns Combined message content for field validation
 */
export const getCombinedMessageForValidation = (messages: Message[], currentMessage: string): string => {
  // Start with the current message
  let combinedContent = currentMessage;
  
  // Look for the last system prompt and include all user messages after it
  let foundSystemPrompt = false;
  
  // Iterate through messages in reverse order
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    
    if (message.isSystemPrompt) {
      foundSystemPrompt = true;
      continue;
    }
    
    // If we found a system prompt and this is a user message, include it
    if (foundSystemPrompt && message.role === 'user') {
      combinedContent += ' ' + message.content;
    }
  }
  
  return combinedContent;
};
