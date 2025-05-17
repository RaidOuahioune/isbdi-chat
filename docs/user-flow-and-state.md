# User Flow and State Management

## Overview

This document details the user flow through the ISBDI Chat System, how the system state changes based on user interactions, and the different execution paths that can occur during a conversation.

## User Flow

![User Flow Diagram](./images/user-flow.png)

### Initial Interaction

1. **System Entry**
   - User opens the chat interface
   - System initializes with a default thread
   - No agent is selected initially

2. **First Query Submission**
   - User submits an initial query
   - If auto-detect is enabled, the system analyzes the query to determine the appropriate agent
   - The system may suggest an agent based on the query content

### Conversation Flow

3. **Agent Interaction**
   - User interacts with the selected agent
   - The agent may request additional information if needed
   - The agent processes the query and returns a response

4. **Tool Usage**
   - Based on the query, the agent may use specialized tools
   - Tools call backend services to process specific requests
   - Tool results are displayed to the user and stored in the thread

5. **Thread Management**
   - User can create new threads for different topics
   - User can switch between existing threads
   - User can delete threads that are no longer needed

## State Management

The system maintains several key state elements that change throughout the user interaction:

### Thread State

```typescript
interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  agentId?: string;
  agentSelection?: AgentSelection;
}
```

- **Creation**: New thread created via `createThread()` function
- **Selection**: Thread selected via `selectThread()` function
- **Deletion**: Thread deleted via `deleteThread()` function
- **Message Updates**: Messages added via `updateThreadMessages()` function
- **Agent Selection**: Agent selection updated via `updateThreadAgentSelection()` function

### Message State

```typescript
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  toolResults?: ToolResult[];
  isStreaming?: boolean;
  isSystemPrompt?: boolean;
}
```

- **User Messages**: Created when user submits a query
- **Assistant Messages**: Created when the system responds
- **Streaming Messages**: Updated incrementally during streaming responses
- **Tool Results**: Added when tools are used to process queries

### Agent Selection State

```typescript
interface AgentSelection {
  agentId: string;
  reason: string;
  requiredInputs?: string[];
  status: 'suggested' | 'confirmed' | 'overridden';
}
```

- **Detection**: Set when the Agent Router analyzes a query
- **Suggestion**: Set when an agent is suggested but not confirmed
- **Confirmation**: Updated when a suggested agent is confirmed
- **Override**: Set when the user manually selects a different agent

### Tool Usage State

- **Tool Selection**: Managed via `toggleTool()` function
- **Tool Used Flag**: Set to `true` once a tool has been used in a thread
- **Available Tools**: Determined based on the selected agent

### UI State

- **Loading State**: Indicates when the system is processing a request
- **Streaming State**: Indicates when a streaming response is in progress
- **Detail Panel State**: Controls the visibility of the detail panel for tool results

## State Transitions

### Thread State Transitions

1. **New Thread**
   - Initial state: Empty thread with no messages
   - Transition: User submits first query
   - New state: Thread with initial user message

2. **Agent Selection**
   - Initial state: Thread without agent selection
   - Transition: Agent detection or manual selection
   - New state: Thread with agent selection

3. **Message Addition**
   - Initial state: Thread with existing messages
   - Transition: User submits new query or system responds
   - New state: Thread with additional message

### Agent Selection State Transitions

1. **No Agent → Suggested Agent**
   - Trigger: User submits query with auto-detect enabled
   - Action: Agent Router analyzes query
   - Result: Agent suggested with reasoning

2. **Suggested Agent → Confirmed Agent**
   - Trigger: User accepts suggested agent
   - Action: System updates agent selection status
   - Result: Agent confirmed for the thread

3. **Suggested/Confirmed Agent → Overridden Agent**
   - Trigger: User manually selects different agent
   - Action: System updates agent selection status
   - Result: New agent selected with "overridden" status

### Tool Usage State Transitions

1. **No Tool → Tool Selected**
   - Trigger: User or system selects a tool
   - Action: Tool is highlighted in the UI
   - Result: Tool ready for use

2. **Tool Selected → Tool Used**
   - Trigger: Query processed with selected tool
   - Action: Tool API called with query content
   - Result: Tool used flag set to true

## Execution Paths

The system supports various execution paths based on user interactions and query types:

### Path 1: Simple Query with Auto-Detect

```
User Query → Agent Detection → Agent Suggestion → User Confirmation → 
Agent Processes Query → Direct Response
```

### Path 2: Tool-Based Query with Auto-Detect

```
User Query → Agent Detection → Agent Suggestion → User Confirmation → 
Tool Selection → Tool API Call → Backend Processing → Response with Tool Results
```

### Path 3: Manual Agent Selection

```
User Query → Manual Agent Selection → Agent Override → 
Tool Selection → Tool API Call → Backend Processing → Response with Tool Results
```

### Path 4: Required Fields Validation

```
User Query → Agent Detection → Agent Suggestion → User Confirmation → 
Required Fields Validation → Missing Fields Prompt → User Provides Additional Info → 
Tool API Call → Backend Processing → Response with Tool Results
```

### Path 5: Streaming Response

```
User Query → Agent Detection → Agent Suggestion → User Confirmation → 
Streaming Response Generation → Incremental UI Updates → Complete Response
```

## Error Handling Paths

### Path 6: Agent Detection Failure

```
User Query → Agent Detection Attempt → Detection Failure → 
Fallback to Default Agent → Direct Response
```

### Path 7: Tool API Error

```
User Query → Agent Selection → Tool API Call → API Error → 
Error Handling → Error Message to User
```

### Path 8: Required Fields Missing

```
User Query → Agent Selection → Required Fields Validation → 
Validation Failure → Error Message with Missing Fields → User Retry
```
