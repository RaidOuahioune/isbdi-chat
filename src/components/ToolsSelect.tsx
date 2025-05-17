import React from 'react';
import { Tool } from '../types/chat';

interface ToolsSelectProps {
  availableTools: Tool[];
  selectedTools: Tool[];
  onToggleTool: (toolId: string) => void;
  className?: string;
  disabled?: boolean;
}

export const ToolsSelect: React.FC<ToolsSelectProps> = ({
  availableTools,
  selectedTools,
  onToggleTool,
  className = '',
  disabled = false
}) => {
  if (availableTools.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 text-[11px] ${className}`}>
      {availableTools.map((tool) => {
        const isSelected = selectedTools.some((t) => t.id === tool.id);
        
        return (
          <button
            key={tool.id}
            type="button"
            className={`inline-flex items-center px-2 py-0.5 rounded-full transition-colors ${disabled ? 'opacity-50 cursor-not-allowed ' : ''} ${
              isSelected
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => !disabled && onToggleTool(tool.id)}
            disabled={disabled}
            title={tool.description}
          >
            {tool.icon && (
              <span className="mr-1 text-[0.95em] leading-none">{tool.icon}</span>
            )}
            {tool.name}
            {isSelected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-2.5 h-2.5 ml-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};
