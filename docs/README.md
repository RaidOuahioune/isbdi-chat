# ISBDI Chat System Documentation

## Overview

This documentation provides a comprehensive overview of the ISBDI (Islamic Banking and Development Institute) Chat System architecture, components, and implementation. The system is designed to provide expert assistance in Islamic finance through a multi-agent architecture that routes user queries to specialized agents based on the nature of the request.

## Table of Contents

1. [Architecture Overview](./architecture-overview.md)
   - System Components
   - Agent System
   - Data Flow
   - Integration Points

2. [Agents and Interactions](./agents-and-interactions.md)
   - Agent Types
   - Agent Interaction Patterns
   - Agent State Transitions
   - Agent Execution Paths

3. [User Flow and State Management](./user-flow-and-state.md)
   - User Flow
   - State Management
   - State Transitions
   - Execution Paths
   - Error Handling Paths

4. [Technical Implementation](./technical-implementation.md)
   - Core Components Implementation
   - Key Interactions Implementation
   - Data Flow Implementation
   - Technology Stack

## Diagrams

The `images` directory contains visual representations of the system architecture and flow:

- [System Architecture](./images/system-architecture.mmd)
- [Data Flow](./images/data-flow.mmd)
- [Agent Types](./images/agent-types.mmd)
- [Agent State Transitions](./images/agent-state-transitions.mmd)
- [User Flow](./images/user-flow.mmd)

To render these diagrams, you can use the Mermaid CLI or any Mermaid-compatible viewer.

## Key Components

### Chat ViewModel (`useChatViewModel.ts`)

The central controller for the application, managing state and business logic. It handles thread management, message processing, agent detection, tool selection, and response generation.

### LLM Service (`gemini.ts`)

Provides natural language understanding and generation capabilities using Google's Gemini API. It handles agent detection, chat response generation, content streaming, and API response summarization.

### Tool API (`toolApi.ts`)

Interfaces with specialized backend services for domain-specific tasks in Islamic finance. It handles tool-specific API calls, payload validation, error handling, and result formatting.

### Agent System

The system employs multiple specialized agents, each designed to handle specific types of tasks:

1. **Journal Entry Generator** - Generates journal entries for Islamic finance transactions
2. **Reverse Accounting Logic** - Analyzes journal entries to explain transactions
3. **Compliance Checker** - Verifies compliance with AAOIFI standards
4. **Product Design Advisor** - Assists in designing Shariah-compliant financial products
5. **Standards Enhancer** - Provides improvements to AAOIFI standards

## Getting Started

To understand the system architecture:

1. Start with the [Architecture Overview](./architecture-overview.md) to get a high-level understanding
2. Explore the [Agents and Interactions](./agents-and-interactions.md) to understand the agent system
3. Review the [User Flow and State Management](./user-flow-and-state.md) to understand how the system handles user interactions
4. Dive into the [Technical Implementation](./technical-implementation.md) for implementation details

## Rendering Diagrams

The diagrams in the `images` directory are in Mermaid format. To render them:

```bash
# Install Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# Render a diagram
mmdc -i ./images/system-architecture.mmd -o ./images/system-architecture.png
```

Alternatively, you can use online Mermaid editors or viewers to render these diagrams.
