export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  toolResults?: ToolResult[];
  isStreaming?: boolean;
}

export interface ToolResult {
  id: string;
  toolName: string;
  result: string | Record<string, any>;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  supportedTools: Tool[];
  isDefault?: boolean;
}

export interface AgentSelection {
  agentId: string;
  reason: string;
  requiredInputs?: string[];
  status: 'suggested' | 'confirmed' | 'overridden';
}

export interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  agentId?: string;
  agentSelection?: AgentSelection;
}
