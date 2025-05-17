import React from 'react';
import { Agent } from '../types/chat';

interface AgentSelectProps {
  availableAgents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agentId: string) => void;
}

export const AgentSelect: React.FC<AgentSelectProps> = ({
  availableAgents,
  selectedAgent,
  onSelectAgent,
}) => {
  if (availableAgents.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-300">Models</h3>
      <ul className="space-y-2">
        {availableAgents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;
          
          return (
            <li key={agent.id}>
              <button
                onClick={() => onSelectAgent(agent.id)}
                className={`w-full flex items-center p-2.5 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden mr-3 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  {agent.avatar ? (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{agent.name}</h4>
                    {agent.isDefault && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded ml-2">
                        Default
                      </span>
                    )}
                  </div>
                  {agent.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {agent.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 ml-2 text-blue-600 dark:text-blue-400 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
