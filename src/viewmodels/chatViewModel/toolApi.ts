import { v4 as uuidv4 } from 'uuid';
import { Tool } from '../../types/chat';
import { api, ProductDesignPayload, ComplianceVerificationPayload } from '../../api';
import { extractProductDesignDataWithLLM, extractComplianceVerificationDataWithLLM } from '../../llms/gemini';

// Helper function to validate required fields for Product Design payload
function validateProductDesignPayload(payload: Partial<ProductDesignPayload>): string[] {
  const requiredFields: (keyof ProductDesignPayload)[] = [
    'product_objective',
    'risk_appetite',
    'investment_tenor',
    'target_audience',
    'desired_features',
    'specific_exclusions'
  ];
  
  const missingFields = requiredFields.filter(field => {
    // For arrays, check if they exist and have at least one item
    if (field === 'desired_features' || field === 'specific_exclusions') {
      return !payload[field] || !(payload[field] as string[]).length;
    }
    // For strings, check if they exist and are not empty
    return !payload[field] || (typeof payload[field] === 'string' && (payload[field] as string).trim() === '');
  });
  
  return missingFields;
}

// Helper function to validate compliance verification payload
function validateComplianceVerificationPayload(payload: Partial<ComplianceVerificationPayload>): string[] {
  const requiredFields: (keyof ComplianceVerificationPayload)[] = [
    'document_content'
  ];
  
  const missingFields = requiredFields.filter(field => {
    return !payload[field] || (typeof payload[field] === 'string' && (payload[field] as string).trim() === '');
  });
  
  return missingFields;
}

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
        try {
          // First, try to parse as JSON directly
          let payload: ProductDesignPayload;
          let extractionMethod = 'direct-json';
          
          try {
            payload = JSON.parse(content);
            console.log('Successfully parsed JSON input for Product Design:', payload);
          } catch (e) {
            // If direct parsing fails, use LLM to extract structured information from natural language
            console.log('Parsing as JSON failed, using LLM to extract product design data');
            extractionMethod = 'llm-extraction';
            
            // Get chat history for context (not implemented yet, would need to be passed from useChatViewModel)
            const chatHistory: Array<{ role: string; parts: string }> = [];
            
            // Use LLM to extract data with context awareness
            const extractedData = await extractProductDesignDataWithLLM(content, chatHistory);
            console.log('LLM extracted data for Product Design:', extractedData);
            
            // Apply manual fixes for common extraction issues
            if (!extractedData.product_objective || extractedData.product_objective.trim() === '') {
              extractedData.product_objective = 'Islamic financial product'; // Default value
            }
            
            if (!extractedData.risk_appetite || extractedData.risk_appetite.trim() === '') {
              extractedData.risk_appetite = 'Medium'; // Default value
            }
            
            if (!extractedData.investment_tenor || extractedData.investment_tenor.trim() === '') {
              extractedData.investment_tenor = '3-5 years'; // Default value
            }
            
            if (!extractedData.target_audience || extractedData.target_audience.trim() === '') {
              extractedData.target_audience = 'Muslim investors'; // Default value
            }
            
            // Ensure arrays have at least one item
            if (!extractedData.desired_features || extractedData.desired_features.length === 0) {
              extractedData.desired_features = ['Shariah compliance'];
            }
            
            if (!extractedData.specific_exclusions || extractedData.specific_exclusions.length === 0) {
              extractedData.specific_exclusions = ['Interest-based components'];
            }
            
            console.log('Enhanced extracted data for Product Design:', extractedData);
            payload = extractedData;
          }
          
          // Validate required fields
          const missingFields = validateProductDesignPayload(payload);
          if (missingFields.length > 0) {
            console.error('Validation failed for Product Design payload:', missingFields);
            console.log('Payload that failed validation:', payload);
            
            // For LLM extraction, try to fix missing fields with defaults instead of failing
            if (extractionMethod === 'llm-extraction') {
              console.log('Attempting to fix missing fields with defaults');
              
              // Apply defaults for missing fields
              if (missingFields.includes('product_objective')) {
                payload.product_objective = 'Islamic financial product';
              }
              
              if (missingFields.includes('risk_appetite')) {
                payload.risk_appetite = 'Medium';
              }
              
              if (missingFields.includes('investment_tenor')) {
                payload.investment_tenor = '3-5 years';
              }
              
              if (missingFields.includes('target_audience')) {
                payload.target_audience = 'Muslim investors';
              }
              
              if (missingFields.includes('desired_features')) {
                payload.desired_features = ['Shariah compliance'];
              }
              
              if (missingFields.includes('specific_exclusions')) {
                payload.specific_exclusions = ['Interest-based components'];
              }
              
              // Check validation again after applying defaults
              const remainingMissingFields = validateProductDesignPayload(payload);
              if (remainingMissingFields.length > 0) {
                throw new Error(`Still missing required information after applying defaults: ${remainingMissingFields.join(', ')}. Please provide all required details.`);
              }
              
              console.log('Successfully fixed missing fields with defaults:', payload);
            } else {
              // For direct JSON input, require the user to provide all fields
              throw new Error(`Missing required information: ${missingFields.join(', ')}. Please provide all required details.`);
            }
          }
          
          console.log('Calling Product Design API with payload:', JSON.stringify(payload, null, 2));
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
        } catch (error) {
          console.error('Product Design API error:', error);
          if (error instanceof Error) {
            throw new Error(`Error calling Product Design API: ${error.message}`);
          } else {
            throw new Error('Unknown error calling Product Design API');
          }
        }
      }

      case 'compliance-verification': {
        // Handle compliance verification tool
        try {
          // First, try to parse as JSON directly
          let payload: ComplianceVerificationPayload;
          
          try {
            payload = JSON.parse(content);
          } catch (e) {
            // If direct parsing fails, use LLM to extract structured information from natural language
            console.log('Parsing as JSON failed, using LLM to extract compliance verification data');
            const extractedData = await extractComplianceVerificationDataWithLLM(content);
            
            // Validate required fields
            const missingFields = validateComplianceVerificationPayload(extractedData);
            if (missingFields.length > 0) {
              throw new Error(`Missing required information: ${missingFields.join(', ')}. Please provide all required details.`);
            }
            
            // Map the extracted data to the expected payload format
            payload = {
              document_content: extractedData.document_content,
              document_name: extractedData.document_name || 'Unnamed Document'
            };
          }
          
          // Validate required fields for JSON input as well
          const missingFields = validateComplianceVerificationPayload(payload);
          if (missingFields.length > 0) {
            throw new Error(`Missing required information: ${missingFields.join(', ')}. Please provide all required details.`);
          }
          
          console.log('Calling Compliance Verification API with payload:', JSON.stringify(payload, null, 2));
          const response = await api.verifyCompliance(payload);
          return {
            id: uuidv4(),
            content: `Compliance Verification for ${payload.document_name || 'Document'}:\n\n${response.compliance_report}`,
            toolResults: [{
              id: uuidv4(),
              toolName: 'Compliance Verification',
              result: response
            }]
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error calling Compliance Verification API: ${error.message}`);
          } else {
            throw new Error('Unknown error calling Compliance Verification API');
          }
        }
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
