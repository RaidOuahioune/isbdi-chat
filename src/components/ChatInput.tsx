import React, { useState, useRef, useEffect } from 'react';
import { Tool } from '../types/chat';
import { ToolsSelect } from './ToolsSelect';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  availableTools: Tool[];
  selectedTools: Tool[];
  onToggleTool: (toolId: string) => void;
  toolsDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  availableTools,
  selectedTools,
  onToggleTool,
  toolsDisabled = false
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-adjust the textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 pr-10 resize-none outline-none rounded-2xl bg-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`absolute right-2 bottom-1.5 p-1.5 rounded-full ${
              !message.trim() || isLoading
                ? 'text-gray-300 dark:text-gray-600'
                : 'text-white bg-blue-500 hover:bg-blue-600'
            } transition-colors`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Tool Selection */}
      {availableTools.length > 0 && (
        <ToolsSelect
          availableTools={availableTools}
          selectedTools={selectedTools}
          onToggleTool={onToggleTool}
          className="mt-2"
          disabled={toolsDisabled}
        />
      )}
    </div>
  );
};
