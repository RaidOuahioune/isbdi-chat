import React from 'react';
import { Message as MessageType } from '../types/chat';

interface MessageProps {
  message: MessageType;
  onViewDetails?: () => void;
}

export const Message: React.FC<MessageProps> = ({ message, onViewDetails }) => {
  const isUserMessage = message.role === 'user';
  
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-3xl p-4 rounded-lg ${
          isUserMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-700 dark:text-white rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block ml-1 animate-pulse text-blue-400 dark:text-blue-300">▋</span>
          )}
        </div>
        
        {/* Render tool results if available */}
        {message.toolResults && message.toolResults.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium mb-1">Tool used: {message.toolResults[0].toolName} </p>
              {onViewDetails && (
                <button 
                  onClick={onViewDetails}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                >
                  View Details
                </button>
              )}
            </div>
         
          </div>
        )}
        
        {/* Display timestamp */}
        <div className={`text-xs mt-1 ${isUserMessage ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
