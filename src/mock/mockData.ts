import { Agent, Tool } from '../types/chat';

// Mock tools
export const mockTools: Tool[] = [
  {
    id: 'journaling',
    name: 'Journaling',
    description: 'Document and process use case scenarios',
    icon: '📝',
  },
  {
    id: 'analyzer',
    name: 'Analyzer',
    description: 'Analyze transactions and financial details',
    icon: '🔍',
  },
  {
    id: 'enhancer',
    name: 'Enhancer',
    description: 'Enhance and improve standards and documentation',
    icon: '✨',
  },
];

// Mock agents
export const mockAgents: Agent[] = [
  {
    id: 'default-assistant',
    name: 'Assistant',
    avatar: '/default-avatar.svg',
    description: 'A general-purpose AI assistant that can help with a wide range of tasks',
    supportedTools: [],
    isDefault: true,
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    avatar: '/default-avatar.svg',
    description: 'An AI assistant specialized in data analysis and visualization',
    supportedTools: [mockTools[2], mockTools[3]],
  },
  {
    id: 'programmer',
    name: 'Programmer',
    avatar: '/default-avatar.svg',
    description: 'An AI assistant specialized in coding assistance and debugging',
    supportedTools: [mockTools[3], mockTools[4]],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    avatar: '/default-avatar.svg',
    description: 'An AI assistant specialized in web search and information gathering',
    supportedTools: [mockTools[0], mockTools[1], mockTools[4]],
  },
];
