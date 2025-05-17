import axios from "axios";

// API base URL - adjust this to your actual API endpoint
const API_BASE_URL = 'http://localhost:8000';

export interface ToolRequestPayload {
  content: string;
  threadId?: string;
}

export interface ToolResponse {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

// New interfaces for the additional endpoints
export interface UseCaseProcessPayload {
  scenario: string;
  standards_info?: {
    extracted_info?: string;
  };
}

export interface UseCaseProcessResponse {
  scenario: string;
  accounting_guidance: string;
}

export interface StandardsExtractionPayload {
  document_text: string;
  query?: string;
}

export interface StandardsExtractionResponse {
  extracted_info: string;
  document_id?: string;
}

export interface TransactionAnalysisPayload {
  transaction_details: string | {
    context: string;
    journal_entries: Array<{
      debit_account: string;
      credit_account: string;
      amount: number;
    }>;
    additional_info?: Record<string, unknown>;
  };
  additional_context?: string;
}

export interface TransactionAnalysisResponse {
  analysis: string;
  compliant: boolean;
  rationale: string;
}

export interface DetailedTransactionPayload {
  transaction_details: string;
  additional_info?: Record<string, unknown>;
}

export interface DetailedTransactionResponse {
  transaction_details: Record<string, unknown>;
  analysis: string;
  compliant: boolean;
  rationale: string;
  
}

export interface StandardsEnhancementPayload {
  standard_id: string;
  trigger_scenario: string;
  include_cross_standard_analysis?: boolean;
}

export interface StandardsEnhancementResponse {
  standard_id: string;
  review: string;
  proposal: string;
  validation: string;
  original_text: string;
  proposed_text: string;
  cross_standard_analysis: string;
  compatibility_matrix: Record<string, unknown>;
}

// Create API client instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Tool-specific API calls
 * These API functions are stateless - they handle a single request without memory
 * Each function corresponds to a specific agent that processes one type of task
 */
export const api = {
  // Call general chat agent when no specific tool is selected
  callChatAgent: async (payload: ToolRequestPayload): Promise<ToolResponse> => {
    try {
      const response = await apiClient.post("/chat/message", payload);
      return response.data;
    } catch (error) {
      console.error("Chat agent error:", error);
      throw error;
    }
  },
  
  // Process use case scenario with the journaling tool
  processUseCase: async (payload: UseCaseProcessPayload): Promise<UseCaseProcessResponse> => {
    try {
      const response = await apiClient.post("/use-case/process", payload);
      return response.data;
    } catch (error) {
      console.error("Use case processing error:", error);
      throw error;
    }
  },
  
  // Extract standards from document text
  extractStandards: async (payload: StandardsExtractionPayload): Promise<StandardsExtractionResponse> => {
    try {
      const response = await apiClient.post("/standards/extract", payload);
      return response.data;
    } catch (error) {
      console.error("Standards extraction error:", error);
      throw error;
    }
  },
  
  // Analyze transaction
  analyzeTransaction: async (payload: TransactionAnalysisPayload): Promise<TransactionAnalysisResponse> => {
    try {
      const response = await apiClient.post("/transaction/analyze-simple", payload);
      return response.data;
    } catch (error) {
      console.error("Transaction analysis error:", error);
      throw error;
    }
  },
  
  // Perform detailed transaction analysis with the analyzer tool
  analyzeTransactionDetailed: async (payload: DetailedTransactionPayload): Promise<DetailedTransactionResponse> => {
    try {
      const response = await apiClient.post("/transaction/analyze", payload);
      return response.data;
    } catch (error) {
      console.error("Detailed transaction analysis error:", error);
      throw error;
    }
  },
  
  // Enhance standards with the enhancer tool
  enhanceStandards: async (payload: StandardsEnhancementPayload): Promise<StandardsEnhancementResponse> => {
    try {
      const response = await apiClient.post("/enhancement/standards", payload);
      return response.data;
    } catch (error) {
      console.error("Standards enhancement error:", error);
      throw error;
    }
  }
};