# ISBDI Chat System Architecture

## Overview

The ISBDI (Islamic Banking and Development Institute) Chat System is a specialized conversational AI platform designed to provide expert assistance in Islamic finance. The system employs a multi-agent architecture that routes user queries to specialized agents based on the nature of the request.

This document outlines the system's architecture, components, data flow, and interaction patterns.

## System Components

![System Architecture](./images/system-architecture.png)

### Core Components

1. **Chat Interface** - The user-facing component that handles message display and user interactions
2. **Chat ViewModel** - The central controller that manages application state and business logic
3. **Agent Router** - Analyzes user queries and determines the most appropriate specialized agent
4. **LLM Service** - Provides natural language understanding and generation capabilities
5. **Tool API** - Interfaces with specialized backend services for domain-specific tasks
6. **Backend Services** - Specialized microservices for different Islamic finance tasks

## Agent System

The system employs multiple specialized agents, each designed to handle specific types of tasks related to Islamic finance:

### Agent Types

1. **Journal Entry Generator**
   - Handles: Detailed Islamic finance transaction scenarios
   - Produces: Correct journal entries compliant with AAOIFI standards
   - Use Case: When users provide narrative transaction descriptions needing accounting output

2. **Reverse Accounting Logic**
   - Handles: Journal entries without narrative context
   - Produces: Explanation of what kind of transaction occurred and applicable AAOIFI standards
   - Use Case: When users provide unexplained or ambiguous journal entries

3. **Compliance Checker**
   - Handles: Financial reports or text documents
   - Produces: Compliance analysis against AAOIFI standards with flagged issues
   - Use Case: When users need to verify if a document is Shariah-compliant

4. **Product Design Advisor**
   - Handles: Requirements for new Islamic finance products
   - Produces: Recommended contract types, relevant FAS standards, and Shariah considerations
   - Use Case: When users need help designing new Islamic finance products

## Data Flow

![Data Flow Diagram](./images/data-flow.png)

### User Interaction Flow

1. User submits a query through the chat interface
2. The Chat ViewModel processes the query and determines if agent detection is needed
3. If enabled, the Agent Router analyzes the query to determine the most appropriate agent
4. The selected agent (either automatically or manually chosen) processes the query
5. The agent may use specialized tools through the Tool API to fulfill the request
6. The response is returned to the user through the chat interface

## State Management

The system maintains several key state elements:

1. **Thread State** - Manages conversation history and context
2. **Agent Selection State** - Tracks which agent is handling the current conversation
3. **Tool Usage State** - Monitors which specialized tools have been used in a thread
4. **Streaming State** - Manages real-time response generation and display

## Key Interactions

### Agent Detection Flow

```
User Query → Agent Router → Agent Selection → Tool Selection → Response Generation
```

### Tool Processing Flow

```
User Query → Selected Tool → Tool API → Backend Service → Response Processing → User Response
```

### Streaming Response Flow

```
User Query → LLM Service → Streaming Response → Incremental UI Updates → Complete Response
```

## Integration Points

The system integrates with several external services:

1. **Google's Gemini API** - Provides the underlying language model capabilities
2. **Backend Microservices** - Specialized services for different Islamic finance tasks
3. **AAOIFI Standards Database** - Reference data for compliance checking and guidance
