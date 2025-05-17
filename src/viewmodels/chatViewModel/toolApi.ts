import { v4 as uuidv4 } from 'uuid';
import { Tool } from '../../types/chat';
import { api } from '../../api';

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
        
      case 'analyzer': {
        // Analyze transaction with the analyzer tool
        const transactionResponse = await api.analyzeTransactionDetailed({
          transaction_details: content
        });
        return {
          id: uuidv4(),
          content: transactionResponse.analysis,
          toolResults: [{
            id: uuidv4(),
            toolName: 'Analyzer',
            result: {
              analysis: transactionResponse.analysis,
              identifiedStandards: transactionResponse.identified_standards,
              retrievalStats: transactionResponse.retrieval_stats
            }
          }]
        };
      }
        
      case 'enhancer': {
        // Extract standard ID and scenario from content (simplified implementation)
        const parts = content.split('|');
        const standardId = parts[0]?.trim() || 'unknown';
        const scenario = parts[1]?.trim() || content;
        
        const enhancementResponse = await api.enhanceStandards({
          standard_id: standardId,
          trigger_scenario: scenario
        });
        return {
          id: uuidv4(),
          content: enhancementResponse.review,
          toolResults: [{
            id: uuidv4(),
            toolName: 'Enhancer',
            result: {
              review: enhancementResponse.review,
              proposal: enhancementResponse.proposal,
              original: enhancementResponse.original_text,
              proposed: enhancementResponse.proposed_text
            }
          }]
        };
      }
        
      default: {
        // For any other tool or when no specific tool handling is implemented
        // Use the generic chat agent API
        const chatResponse = await api.callChatAgent({
          content,
          threadId: activeThreadId || undefined
        });
        return {
          id: chatResponse.id || uuidv4(),
          content: chatResponse.content,
          toolResults: chatResponse.metadata ? [{
            id: uuidv4(),
            toolName: 'Chat Agent',
            result: chatResponse.metadata
          }] : undefined
        };
      }
    }
  } catch (error) {
    console.error(`Error calling ${tool.name} API:`, error);
    // Return an error response
    return {
      id: uuidv4(),
      content: `Sorry, I encountered an error when using the ${tool.name} tool. Please try again later.`,
      toolResults: [{
        id: uuidv4(),
        toolName: tool.name,
        result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]
    };
  }
};
