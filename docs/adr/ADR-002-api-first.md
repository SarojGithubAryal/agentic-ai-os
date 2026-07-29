# ADR-002: API First Architecture

**Status:** Accepted

**Date:** 2026-07-27

**Decision Owners:** Architecture Team

---

# 1. Context

Agentic AI OS is designed to become an intelligence platform consumed by multiple applications.

Potential clients include:

- Home
- Bakery
- Sewa Bazaar
- Story applications
- Future external applications

A key architectural decision is how applications should communicate with the platform.

Possible approaches:

1. Direct library integration
2. Shared codebase integration
3. API-first architecture

---

# 2. Decision

Agentic AI OS will follow an **API-first architecture**.

All client applications communicate with Agentic AI OS through stable APIs.

Applications must not directly access:

- AI providers
- Internal services
- Database layers
- Agent implementations
- Tool execution systems

---

# 3. Architecture Model

```
              Client Applications

        ┌──────────┬──────────┬──────────┐

        │  Home    │ Bakery   │ Sewa     │

        └──────────┴──────────┴──────────┘

                    |

                    ▼

              Agentic AI OS API

                    |

                    ▼

          Internal Platform Modules

                    |

                    ▼

             AI Providers
```

---

# 4. Alternatives Considered

## Option 1: Direct Provider Integration

Applications communicate directly with:

- OpenAI
- Gemini
- Claude
- Other providers

### Advantages

- Simple initial implementation.
- No additional platform layer.

### Disadvantages

- Provider lock-in.
- Duplicate logic.
- Inconsistent AI behavior.
- Difficult migration.
- Security risks.

Rejected.

---

## Option 2: Shared Internal Library

Applications import Agentic AI OS code directly.

### Advantages

- Simple communication.
- No network overhead.

### Disadvantages

- Tight coupling.
- Difficult independent deployment.
- Language limitations.
- Poor external integration.

Rejected.

---

## Option 3: API First

Applications communicate through APIs.

### Advantages

- Clear boundary.
- Provider independence.
- Multiple language support.
- SDK compatibility.
- Easier scaling.
- Better security.

Selected.

---

# 5. API Responsibilities

The API layer is responsible for:

- Authentication
- Authorization
- Request validation
- Rate limiting
- Response formatting
- Streaming
- Error handling
- Observability

---

# 6. Client Independence

Applications should only understand:

- API contracts
- SDK interfaces
- Authentication methods

They should not know:

- Which LLM provider is used.
- How memory is stored.
- How agents work internally.
- How workflows execute.

---

# 7. SDK Relationship

The SDK is built on top of the API.

Architecture:

```
Application

↓

Agentic AI OS SDK

↓

Agentic AI OS API

↓

Platform
```

The SDK improves developer experience but does not replace the API boundary.

---

# 8. Versioning Strategy

The API must support evolution.

Example:

```
/api/v1/

/api/v2/
```

Breaking changes require a new version.

Backward compatibility should be maintained whenever practical.

---

# 9. Consequences

## Positive Consequences

The architecture provides:

- Application independence.
- Provider flexibility.
- Easier integrations.
- Better security.
- Future external access.

---

## Negative Consequences

The system requires:

- API maintenance.
- Version management.
- Network communication.
- Additional authentication handling.

---

# 10. Implementation Impact

The project should prioritize:

- API contracts before implementation.
- OpenAPI documentation.
- Request and response schemas.
- Stable interfaces.

Internal implementation may evolve without affecting clients.

---

# 11. Final Decision

Agentic AI OS will use an API-first architecture.

The API is the primary communication boundary between applications and the intelligence platform.

This ensures the platform remains reusable, scalable, and independent from individual products.

---

# Related Documents

- api-spec.md
- sdk.md
- 02-high-level-architecture.md
- ADR-001-modular-monolith.md