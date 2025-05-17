import React, { useRef, useEffect } from 'react';
import { Message as MessageComponent } from './Message';
import { ChatInput } from './ChatInput';
import { IsdbiLogoSvg } from './IsdbiLogo';
import { DetailPanel } from './DetailPanel';
import { Message, Tool } from '../types/chat';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming?: boolean;
  streamingContent?: string;
  toolUsed?: boolean;
  detailPanelContent?: any;
  isDetailPanelOpen?: boolean;
  onSendMessage: (content: string) => void;
  availableTools: Tool[];
  selectedTools: Tool[];
  onToggleTool: (toolId: string) => void;
  onOpenDetailPanel?: (content: any) => void;
  onCloseDetailPanel?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  isStreaming = false,
  streamingContent = '', // Used by the Message component via the isStreaming flag on messages
  toolUsed = false,
  detailPanelContent = null,
  isDetailPanelOpen = false,
  onSendMessage,
  availableTools,
  selectedTools,
  onToggleTool,
  onOpenDetailPanel = () => {},
  onCloseDetailPanel = () => {},
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="p-4">
              <IsdbiLogoSvg 
                width={80} 
                height={80}
                className="mb-2 px-1 opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageComponent 
                key={message.id} 
                message={message} 
                onViewDetails={message.toolResults && message.toolResults.length > 0 ? () => onOpenDetailPanel({
                  toolName: message.toolResults[0]?.toolName || 'API Response',
                  response: message.toolResults[0]?.result || message.content
                }) : undefined}
              />
            ))}
            {isLoading && !isStreaming && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {isStreaming && (
              <div className="flex justify-start mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg rounded-bl-none max-w-3xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>   
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700/50">
        <ChatInput 
          onSendMessage={onSendMessage} 
          isLoading={isLoading || isStreaming}
          availableTools={availableTools}
          selectedTools={selectedTools}
          onToggleTool={onToggleTool}
          toolsDisabled={toolUsed}
        />
      </div>
      
      {/* Detail Panel for API Responses */}
      {isDetailPanelOpen && detailPanelContent && (
        <DetailPanel
          isOpen={isDetailPanelOpen}
          onClose={onCloseDetailPanel}
          title={detailPanelContent.toolName || 'API Response'}
          content={detailPanelContent.response}
        />
      )}
    </div>
  );
};
