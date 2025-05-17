// Common types for DetailPanel components

export interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: any;
}

export interface UseCaseResponseData {
  scenario: string;
  accounting_guidance: string;
}

export interface StandardInfo {
  standard_id: string;
  name: string;
  probability: string;
  reasoning: string;
}

export interface AnalyzerResponseData {
  transaction_details: Record<string, any>;
  analysis: string;
  identified_standards: string[];
  retrieval_stats: {
    chunk_count: number;
    chunks_summary: string[];
  };
  transaction_summary?: string;
  correct_standard: string;
  applicable_standards: StandardInfo[];
  standard_rationale: string;
}

export interface ProductDesignResponseData {
  suggested_product_concept_name: string;
  recommended_islamic_contracts: string[];
  original_requirements: {
    product_objective: string;
    risk_appetite: string;
    investment_tenor: string;
    target_audience: string;
    asset_focus?: string;
    desired_features: string[];
    specific_exclusions: string[];
    additional_notes: string;
  };
  rationale_for_contract_selection: string;
  proposed_product_structure_overview: string;
  key_aaoifi_fas_considerations: {
    standard_id: string;
    [key: string]: any;
  };
  shariah_compliance_checkpoints: string[];
  potential_areas_of_concern: string[];
  potential_risks_and_mitigation_notes: string;
  next_steps_for_detailed_design: string[];
}

export interface ComplianceVerificationResponseData {
  document_name: string;
  timestamp: string;
  compliance_report: string;
  structured_report: Array<{
    standard: string;
    requirement: string;
    status: string;
    status_code: 'compliant' | 'partial' | 'missing';
    comments: string;
  }>;
  document: string;
}
