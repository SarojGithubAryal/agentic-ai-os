# ADR-005: Memory vs Knowledge Separation

**Status:** Accepted

**Date:** 2026-07-27

**Decision Owners:** Architecture Team

---

# 1. Context

Agentic AI OS requires the ability to provide context to agents and workflows.

Context may come from different sources:

- User conversations
- Previous interactions
- Uploaded documents
- Research material
- Business information
- Application data

A common mistake in AI architectures is storing all information inside a single memory system.

This creates problems with:

- Data ownership.
- Retrieval quality.
- Security.
- Lifecycle management.
- Information relevance.

---

# 2. Decision

Agentic AI OS will maintain separate systems for:

1. Memory
2. Knowledge

Although both systems may use similar technologies such as vector search, they represent fundamentally different concepts.

---

# 3. Definitions

## Memory

Memory represents information generated through interaction.

Examples:

- User preferences.
- Previous conversations.
- Agent experiences.
- Project context.
- User-specific facts.

Memory answers:

> "What does the system remember about this interaction or user?"

---

## Knowledge

Knowledge represents information intentionally provided to the system.

Examples:

- Documents.
- Manuals.
- Research papers.
- Company information.
- Product information.
- External references.

Knowledge answers:

> "What information has been given to the system to understand?"

---

# 4. Architecture Model

```
                  Agent Request

                       |

                       ▼

              Context Assembly Layer

                       |

          ┌────────────┴────────────┐

          ▼                         ▼

      Memory Engine          Knowledge Engine

          |                         |

 User interaction data      External information

```

---

# 5. Problem With Combined Storage

If memory and knowledge are combined:

Example:

```
User says:

"I prefer dark mode."

↓

Stored with company documentation.
```

Later:

```
Search:

"Company design preferences"
```

The system may incorrectly retrieve:

"User prefers dark mode."

This creates inaccurate responses.

---

# 6. Alternatives Considered

## Option 1: Single Unified Context Store

All information stored together.

### Advantages

- Simple implementation.
- One retrieval system.

### Disadvantages

- Poor separation.
- Security risks.
- Lower retrieval accuracy.
- Difficult data management.

Rejected.

---

## Option 2: Separate Memory and Knowledge Systems

Different systems with controlled interaction.

### Advantages

- Better accuracy.
- Clear ownership.
- Better security.
- Easier lifecycle management.

Selected.

---

# 7. Memory Responsibilities

The Memory Engine manages:

- Conversation history.
- User preferences.
- Personal context.
- Agent observations.
- Long-term memory.

Memory requires:

- User isolation.
- Application isolation.
- Privacy controls.

---

# 8. Knowledge Responsibilities

The Knowledge Engine manages:

- Documents.
- Files.
- Research data.
- External sources.
- Structured information.

Knowledge requires:

- Source tracking.
- Permissions.
- Version management.

---

# 9. Context Assembly

Agents should not directly query memory and knowledge independently.

A context layer should determine:

- Which memory is relevant.
- Which knowledge is relevant.
- How much context is needed.

Example:

```
User Question

↓

Context Assembly

↓

Relevant Memory

+

Relevant Knowledge

↓

Agent Execution

```

---

# 10. Security Benefits

The separation improves:

- Permission control.
- Data isolation.
- Privacy management.
- Compliance readiness.

Example:

A personal memory should never automatically become organizational knowledge.

---

# 11. Storage Considerations

Both systems may use:

- PostgreSQL.
- pgvector.
- Metadata storage.

However, they maintain separate:

- Namespaces.
- Ownership.
- Access rules.
- Lifecycle policies.

---

# 12. Consequences

## Positive Consequences

Provides:

- Better retrieval accuracy.
- Clear data ownership.
- Improved privacy.
- Easier management.
- Better AI behavior.

---

## Negative Consequences

Requires:

- Additional architecture.
- More complex context management.
- More storage rules.

---

# 13. Future Enhancements

Possible future capabilities:

- Automatic memory extraction.
- Knowledge validation.
- Memory summarization.
- Knowledge graphs.
- Advanced context ranking.
- Human-controlled memory management.

---

# 14. Final Decision

Agentic AI OS will maintain separate Memory and Knowledge systems.

Memory represents learned interaction context.

Knowledge represents provided information.

They may work together during AI execution, but they must remain architecturally separate.

---

# Related Documents

- memory-system.md
- knowledge-engine.md
- agent-framework.md
- workflow-engine.md
- ADR-003-provider-abstraction.md