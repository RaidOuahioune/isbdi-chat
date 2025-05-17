import { Message, Tool, Thread } from '../../types/chat';

export interface ChatViewModel {
  messages: Message[];
  isLoading: boolean;
  selectedTools: Tool[];
  availableTools: Tool[];
  isUseMockData: boolean;
  threads: Thread[];
  activeThreadId: string | null;
  detailPanelContent: any;
  isDetailPanelOpen: boolean;
  toolUsed: boolean;
  isStreaming: boolean;
  streamingContent: string;
  sendMessage: (content: string) => Promise<void>;
  toggleTool: (toolId: string) => void;
  clearChat: () => void;
  toggleMockData: () => void;
  createThread: () => void;
  selectThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  openDetailPanel: (content: any) => void;
  closeDetailPanel: () => void;
}
