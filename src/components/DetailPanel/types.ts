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

export interface AnalyzerResponseData {
  analysis: string;
  compliant?: boolean;
  rationale?: string;
  identifiedStandards?: string[];
  retrievalStats?: {
    chunk_count: number;
    chunks_summary: string[];
  };
}
