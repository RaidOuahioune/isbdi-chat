# Agents and Interactions

## Agent System Overview

The ISBDI Chat System employs a sophisticated multi-agent architecture to provide specialized expertise in Islamic finance. This document details the agents used in the system, their interactions, and how they collaborate to fulfill user requests.

## Agent Types

![Agent Types](./images/agent-types.png)

### 1. Agent Router

**Purpose**: Acts as the initial entry point for user queries, analyzing the content to determine which specialized agent is best suited to handle the request.

**Key Functions**:
- Analyzes user queries using natural language understanding
- Determines the most appropriate specialized agent based on query content
- Provides reasoning for agent selection
- Identifies required inputs for the selected agent

**Implementation**:
- Uses the Gemini LLM with a specialized system prompt
- Implemented in `src/llms/gemini.ts` via the `detectAgent` function
- Returns an `AgentDetectionResult` with agent ID, reason, and required inputs

### 2. Journal Entry Generator

**Purpose**: Generates correct journal entries for Islamic finance transactions according to AAOIFI standards.

**Key Functions**:
- Processes detailed Islamic finance transaction scenarios
- Generates compliant journal entries
- Explains accounting treatments for specific Islamic finance instruments
- Provides guidance on asset recognition, amortization, and profit distribution

**Implementation**:
- Accessed through the `journaling` tool in `toolApi.ts`
- Calls the `/use-case/process` backend API endpoint
- Processes scenarios and returns structured accounting guidance

### 3. Reverse Accounting Logic

**Purpose**: Analyzes journal entries to explain the underlying Islamic finance transactions.

**Key Functions**:
- Reverse-engineers journal entries to identify transaction types
- Determines applicable AAOIFI standards
- Explains the rationale behind accounting treatments
- Identifies potential compliance issues

**Implementation**:
- Accessed through the `analyzer` tool in `toolApi.ts`
- Calls the `/transaction/analyze` backend API endpoint
- Returns detailed analysis of the transaction

### 4. Compliance Checker

**Purpose**: Verifies if financial reports or documents comply with AAOIFI standards.

**Key Functions**:
- Scans documents for compliance with Shariah principles
- Identifies violations or inconsistencies with AAOIFI standards
- Provides structured compliance reports
- Flags specific issues with references to relevant standards

**Implementation**:
- Accessed through the `compliance-verification` tool in `toolApi.ts`
- Calls the `/compliance/verify` backend API endpoint
- Returns comprehensive compliance analysis

### 5. Product Design Advisor

**Purpose**: Assists in designing new Islamic finance products that comply with Shariah principles.

**Key Functions**:
- Recommends appropriate Islamic contract types (e.g., Murabaha, Musharaka)
- Maps product requirements to relevant FAS standards
- Outlines Shariah compliance considerations
- Identifies potential risks and mitigation strategies

**Implementation**:
- Accessed through the `product-design` tool in `toolApi.ts`
- Calls the `/product-design` backend API endpoint
- Returns structured product design recommendations

### 6. Standards Enhancer

**Purpose**: Provides improvements and cross-standard analysis for AAOIFI standards.

**Key Functions**:
- Reviews existing standards in light of specific scenarios
- Proposes enhancements to standards
- Performs cross-standard compatibility analysis
- Validates proposed changes against Shariah principles

**Implementation**:
- Accessed through the `enhancer` tool in `toolApi.ts`
- Calls the `/standards/enhance` backend API endpoint
- Returns detailed enhancement proposals

## Agent Interaction Patterns

### Agent Selection Process

1. **Automatic Detection**:
   - User query is analyzed by the Agent Router
   - The most appropriate agent is suggested based on query content
   - The system provides reasoning for the selection
   - The user can confirm or override the suggestion

2. **Manual Selection**:
   - User explicitly selects a specialized agent
   - Selection is recorded as "overridden" in the thread state
   - The system adapts to the user's preference

### Inter-Agent Communication

Agents do not directly communicate with each other but share context through:

1. **Thread State**:
   - Conversation history is maintained in the thread
   - Previous agent responses are available as context
   - Agent selections are recorded in the thread state

2. **Tool Results**:
   - Results from specialized tools are stored in message objects
   - These results can be referenced by subsequent agent interactions
   - Provides continuity across different agent interactions

## Agent State Transitions

![Agent State Transitions](./images/agent-state-transitions.png)

1. **Initial State**:
   - No agent selected
   - System ready to detect or receive agent selection

2. **Agent Detection**:
   - Agent Router analyzing user query
   - System in "detecting" state

3. **Agent Suggested**:
   - Agent selected with "suggested" status
   - Awaiting user confirmation or override

4. **Agent Confirmed**:
   - Agent selection confirmed
   - Status updated to "confirmed"
   - Ready to process user query

5. **Agent Overridden**:
   - User manually selects different agent
   - Status updated to "overridden"
   - System adapts to user preference

## Agent Execution Paths

Different execution paths exist depending on the user's query and the selected agent:

### Path 1: Direct Query Processing
```
User Query → Agent Router → Agent Selection → Direct Response
```

### Path 2: Tool-Based Processing
```
User Query → Agent Router → Agent Selection → Tool API → Backend Service → Response
```

### Path 3: Multi-Step Processing
```
User Query → Agent Router → Agent Selection → Required Fields Validation → 
User Provides Additional Info → Tool API → Backend Service → Response
```

### Path 4: Manual Override
```
User Query → Manual Agent Selection → Tool API → Backend Service → Response
```
