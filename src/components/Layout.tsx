import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatContainer } from './ChatContainer';
import AgentStatusBar from './AgentStatusBar';

import { useDarkMode } from '../hooks/useDarkMode';
import { ChatViewModel } from '../viewmodels/chatViewModel';

interface LayoutProps {
  viewModel: ChatViewModel;
}

export const Layout: React.FC<LayoutProps> = ({ viewModel }) => {
  const { theme, toggleTheme } = useDarkMode();
  
  // Use destructuring with type assertion to fix TypeScript errors
  const {
    messages,
    isLoading,
    selectedTools,
    availableTools,
    isUseMockData,
    threads,
    activeThreadId,
    detailPanelContent,
    isDetailPanelOpen,
    toolUsed,
    isStreaming,
    streamingContent,
    sendMessage,
    toggleTool,
    clearChat,
    toggleMockData,
    createThread,
    selectThread,
    deleteThread,
    openDetailPanel,
    closeDetailPanel,
  } = viewModel;
  
  // Use type assertion for the new properties
  const isAutoDetectAgent = (viewModel as any).isAutoDetectAgent || false;
  const isDetectingAgent = (viewModel as any).isDetectingAgent || false;
  const setIsAutoDetectAgent = (viewModel as any).setIsAutoDetectAgent || ((isEnabled: boolean) => {
    // This is a fallback implementation that does nothing
    console.log(`Auto-detect agent ${isEnabled ? 'enabled' : 'disabled'}`); 
  });

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onClearChat={clearChat}
        onCreateThread={createThread}
        onSelectThread={selectThread}
        onDeleteThread={deleteThread}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700"
      />
      
      <main className="flex-1 flex flex-col h-full">
        <header className="shadow-sm border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="font-semibold text-blue-700 dark:text-blue-300">Financial Assistant</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Display selected tools */}
              {selectedTools.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Active tools:
                  </span>
                  {selectedTools.map((tool) => (
                    <span
                      key={tool.id}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center"
                    >
                      {tool.icon && <span className="mr-1">{tool.icon}</span>}
                      {tool.name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* API/Mock toggle */}
              <button 
                onClick={toggleMockData} 
                className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isUseMockData 
                    ? 'text-yellow-500 dark:text-yellow-300' 
                    : 'text-green-500 dark:text-green-300'
                }`}
                title={isUseMockData ? "Using mock data (click to use API)" : "Using real API (click to use mock data)"}
              >
                {isUseMockData ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                  </svg>
                )}
              </button>
              
              {/* Dark mode toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
        
        {/* Agent Status Bar */}
        {(selectedTools.length > 0 || isDetectingAgent) && (
          <AgentStatusBar
            selectedTool={selectedTools[0]}
            agentSelection={activeThreadId ? threads.find(t => t.id === activeThreadId)?.agentSelection : undefined}
            isDetectingAgent={isDetectingAgent}
            isAutoDetectAgent={isAutoDetectAgent}
            setIsAutoDetectAgent={setIsAutoDetectAgent}
          />
        )}
        
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          toolUsed={toolUsed}
          detailPanelContent={detailPanelContent}
          isDetailPanelOpen={isDetailPanelOpen}
          onSendMessage={sendMessage}
          availableTools={availableTools}
          selectedTools={selectedTools}
          onToggleTool={toggleTool}
          onOpenDetailPanel={openDetailPanel}
          onCloseDetailPanel={closeDetailPanel}
        />
      </main>
    </div>
  );
};
