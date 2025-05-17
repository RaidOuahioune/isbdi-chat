import React from 'react';
import { AgentSelection, Tool } from '../types/chat';

interface AgentStatusBarProps {
  agentSelection?: AgentSelection;
  selectedTool?: Tool;
  isDetectingAgent: boolean;
  isAutoDetectAgent: boolean;
  setIsAutoDetectAgent: (value: boolean) => void;
}

const AgentStatusBar: React.FC<AgentStatusBarProps> = ({
  agentSelection,
  selectedTool,
  isDetectingAgent,
  isAutoDetectAgent,
  setIsAutoDetectAgent
}) => {
  if (!agentSelection && !selectedTool && !isDetectingAgent) {
    return null;
  }

  const getStatusText = () => {
    if (isDetectingAgent) {
      return 'Detecting appropriate agent...';
    }
    
    if (agentSelection) {
      switch (agentSelection.status) {
        case 'suggested':
          return 'Suggested by system';
        case 'confirmed':
          return 'Confirmed by user';
        case 'overridden':
          return 'Manually selected';
        default:
          return '';
      }
    }
    
    return '';
  };

  const getAgentName = () => {
    if (isDetectingAgent) {
      return 'Detecting...';
    }
    
    if (selectedTool) {
      return selectedTool.name;
    }
    
    return 'No agent selected';
  };

  // getAgentIcon function has been replaced by getAgentIconFromStyles
  
  const getAgentStyles = (agentId: string) => {
    switch (agentId) {
      case 'journaling':
        return { color: '#10B981', icon: '📝' }; // Green with journal icon
      case 'analyzer':
        return { color: '#3B82F6', icon: '🔍' }; // Blue with magnifying glass
      case 'compliance-verification':
        return { color: '#8B5CF6', icon: '✓' }; // Purple with checkmark
      case 'product-design':
        return { color: '#F59E0B', icon: '💡' }; // Amber with lightbulb
      case 'chat':
        return { color: '#4F46E5', icon: '💬' }; // Indigo with chat bubble
      default:
        return { color: '#6B7280', icon: '🤖' }; // Gray with robot
    }
  };

  const getStatusColor = () => {
    if (isDetectingAgent) {
      return '#6B7280'; // Gray
    }
    
    if (agentSelection) {
      const agentStyles = getAgentStyles(agentSelection.agentId);
      return agentStyles.color;
    }
    
    return '#6B7280'; // Gray
  };
  
  const getAgentIconFromStyles = () => {
    if (isDetectingAgent) {
      return '🔍';
    }
    
    if (selectedTool) {
      return selectedTool.icon || '🤖';
    }
    
    if (agentSelection) {
      const agentStyles = getAgentStyles(agentSelection.agentId);
      return agentStyles.icon;
    }
    
    return '🤖';
  };
  
  return (
    <div className="agent-status-bar">
      <div className="agent-badge" style={{ backgroundColor: getStatusColor() }}>
        <span className="agent-icon">{getAgentIconFromStyles()}</span>
        <span className="agent-name">{getAgentName()}</span>
      </div>
      <div className="agent-info">
        {agentSelection && agentSelection.reason && (
          <div className="agent-reason">
            <strong>Why:</strong> {agentSelection.reason}
          </div>
        )}
        <div className="agent-status">
          <strong>Status:</strong> {getStatusText()}
        </div>
        {agentSelection && agentSelection.requiredInputs && agentSelection.requiredInputs.length > 0 && (
          <div className="agent-required-inputs">
            <strong>Required inputs:</strong>
            <ul className="required-inputs-list">
              {agentSelection.requiredInputs.map((input, index) => (
                <li key={index} className="required-input-item">
                  <span className="required-input-bullet">•</span> {input}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="agent-controls">
        <label className="auto-detect-toggle">
          <input
            type="checkbox"
            checked={isAutoDetectAgent}
            onChange={(e) => setIsAutoDetectAgent(e.target.checked)}
          />
          Auto-detect agent
        </label>
      </div>
      <style>{`
        .agent-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .agent-badge {
          display: flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 16px;
          color: white;
          font-weight: 500;
          gap: 6px;
        }
        
        .agent-icon {
          font-size: 16px;
        }
        
        .agent-info {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          color: #4b5563;
        }
        
        .agent-required-inputs {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .required-inputs-list {
          list-style: none;
          padding-left: 0;
          margin: 4px 0 0 0;
        }
        
        .required-input-item {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
          background-color: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .required-input-bullet {
          color: #3B82F6;
          margin-right: 6px;
          font-weight: bold;
        }
        
        .agent-controls {
          display: flex;
          align-items: center;
        }
        
        .auto-detect-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          background-color: #f1f5f9;
          padding: 4px 10px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .auto-detect-toggle:hover {
          background-color: #e2e8f0;
        }
        
        .auto-detect-toggle input {
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .agent-status-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .agent-info {
            margin-top: 8px;
            flex-direction: column;
            gap: 4px;
            width: 100%;
          }
          
          .agent-controls {
            margin-top: 8px;
            width: 100%;
          }
          
          .auto-detect-toggle {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentStatusBar;
