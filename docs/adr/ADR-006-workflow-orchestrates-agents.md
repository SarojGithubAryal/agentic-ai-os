# ADR-006: Workflow Orchestrates Agents

**Status:** Accepted

**Date:** 2026-07-27

**Decision Owners:** Architecture Team

---

# 1. Context

Agentic AI OS supports intelligent automation through:

- Agents
- Workflows
- Tools
- Memory
- Knowledge

A key architectural question is how agents should execute complex tasks.

Possible approaches:

1. Agents independently control execution.
2. Workflows control agents.
3. A fully autonomous agent system.

The system requires a balance between intelligence and reliability.

---

# 2. Decision

Agentic AI OS will use a workflow-oriented agent architecture.

Workflows orchestrate agents.

Agents perform reasoning and specialized tasks within workflow boundaries.

---

# 3. Architecture Model

```
                  User Request

                       |

                       ▼

               Workflow Engine

                       |

        ┌──────────────┼──────────────┐

        ▼              ▼              ▼

    Research Agent   Writing Agent   Review Agent

        |              |              |

        ▼              ▼              ▼

              Tool Execution Layer

                       |

                       ▼

              External Capabilities

```

---

# 4. Definitions

## Workflow

A workflow defines:

- Steps
- Order of execution
- Conditions
- Inputs
- Outputs
- Error handling
- Recovery behavior

A workflow provides structure.

---

## Agent

An agent provides:

- Reasoning
- Decision making
- Task execution
- Specialized intelligence

An agent provides capability.

---

# 5. Problem With Fully Autonomous Agents

Allowing agents to freely control execution creates:

- Unpredictable behavior.
- Difficult debugging.
- Poor observability.
- Higher costs.
- Security risks.

Example:

An uncontrolled agent may:

```
Search

↓

Use expensive tool

↓

Repeat unnecessarily

↓

Produce inconsistent output
```

---

# 6. Alternatives Considered

## Option 1: Agent-Driven Architecture

Agents control all execution.

### Advantages

- High autonomy.
- Flexible behavior.

### Disadvantages

- Difficult control.
- Hard to debug.
- Difficult auditing.
- Higher risk.

Rejected.

---

## Option 2: Workflow-Orchestrated Agents

Workflows control execution while agents provide intelligence.

### Advantages

- Predictable behavior.
- Better monitoring.
- Easier testing.
- Better security.
- Clear execution history.

Selected.

---

## Option 3: Fully Static Workflows

No agent reasoning.

### Advantages

- Highly predictable.
- Simple implementation.

### Disadvantages

- Limited intelligence.
- Cannot handle complex situations.

Rejected.

---

# 7. Workflow Responsibilities

The Workflow Engine manages:

- Execution order.
- State management.
- Checkpoints.
- Retries.
- Failures.
- Agent coordination.
- Tool permissions.

---

# 8. Agent Responsibilities

Agents manage:

- Understanding tasks.
- Reasoning.
- Generating solutions.
- Making decisions within allowed boundaries.

Agents do not manage:

- Global execution state.
- Security permissions.
- Workflow control.

---

# 9. Example

Research workflow:

```
User Request

↓

Planning Step

↓

Research Agent

↓

Knowledge Retrieval

↓

Analysis Agent

↓

Review Agent

↓

Final Response
```

The workflow controls the process.

Agents provide intelligence at each stage.

---

# 10. Benefits

## Reliability

Workflows provide predictable execution.

---

## Observability

Every step can be tracked.

Example:

```
Workflow Started

↓

Agent Executed

↓

Tool Called

↓

Result Received

↓

Workflow Completed
```

---

## Security

Permissions can be enforced before actions occur.

---

## Testing

Individual workflow steps can be tested independently.

---

# 11. Human Oversight

Future workflows may support:

- Approval steps.
- Manual review.
- Human intervention.
- Escalation paths.

---

# 12. Consequences

## Positive Consequences

Provides:

- Controlled autonomy.
- Better reliability.
- Easier debugging.
- Better security.
- Production readiness.

---

## Negative Consequences

Requires:

- Workflow design.
- More planning.
- Additional execution infrastructure.

---

# 13. Future Enhancements

Possible future capabilities:

- Dynamic workflow generation.
- Self-improving workflows.
- Multi-agent collaboration.
- Human-agent collaboration.
- Workflow optimization.

---

# 14. Final Decision

Agentic AI OS will use workflows as the primary orchestration layer.

Agents provide intelligence inside controlled workflows.

This approach enables scalable, observable, and reliable agentic systems suitable for production environments.

---

# Related Documents

- workflow-engine.md
- agent-framework.md
- tool-engine.md
- memory-system.md
- knowledge-engine.md
- ADR-005-memory-vs-knowledge.md