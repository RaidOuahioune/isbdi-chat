import { v4 as uuidv4 } from 'uuid';
import { Tool } from '../../types/chat';
import { 
  api, 
  ProductDesignPayload, 
  ComplianceVerificationPayload
} from '../../api';

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
              ...transactionResponse
            }
          }]
        };
      }
        
      case 'enhancer': {
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
        
      case 'product-design': {
        // Handle product design tool
        const payload: ProductDesignPayload = JSON.parse(content);
        const response = await api.designProduct(payload);
        return {
          id: uuidv4(),
          content: `Product Design: ${response.suggested_product_concept_name}\n\n${response.rationale_for_contract_selection}`,
          toolResults: [{
            id: uuidv4(),
            toolName: 'Product Design',
            result: response
          }]
        };
      }

      case 'compliance-verification': {
        // Handle compliance verification tool
        const payload: ComplianceVerificationPayload = JSON.parse(content);
        const response = await api.verifyCompliance(payload);
        return {
          id: uuidv4(),
          content: `Compliance Verification Report for ${response.document_name}\n\n${response.compliance_report}`,
          toolResults: [{
            id: uuidv4(),
            toolName: 'Compliance Verification',
            result: response
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
