// Export the main hook
export { useChatViewModel } from './useChatViewModel';

// Export types
export type { ChatViewModel } from './types';

// Export utility functions that might be useful elsewhere
export { createInitialThread, initialMessages } from './threadUtils';
export { getGeminiHistory } from './messageUtils';
export { callToolSpecificApi } from './toolApi';
export { useDetailPanel } from './panelUtils';
