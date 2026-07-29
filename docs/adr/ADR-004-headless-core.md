# ADR-004: Headless Core Architecture

**Status:** Accepted

**Date:** 2026-07-27

**Decision Owners:** Architecture Team

---

# 1. Context

Agentic AI OS is designed to serve multiple applications.

Examples:

- Home
- Bakery
- Sewa Bazaar
- Story applications
- Future external products

Each application has different:

- User interfaces
- User experiences
- Business logic
- Workflows
- Branding requirements

A key architectural decision is whether Agentic AI OS should provide its own user interface or operate as a headless intelligence platform.

---

# 2. Decision

Agentic AI OS will follow a **headless core architecture**.

The platform will provide intelligence capabilities through APIs and SDKs while remaining independent from user interfaces.

The platform does not own:

- Web interfaces
- Mobile applications
- Product-specific UI
- User experience design

---

# 3. Architecture Model

```
                 Client Applications


        ┌──────────┬──────────┬──────────┐

        │  Home    │ Bakery   │ Sewa     │

        └──────────┴──────────┴──────────┘


                    │

                    ▼


              Agentic AI OS


        ┌────────────────────────┐

        │ Intelligence Platform  │

        │                        │

        │ Agents                 │

        │ Memory                 │

        │ Knowledge              │

        │ Workflows              │

        │ Tools                  │

        │ Providers              │

        └────────────────────────┘
```

---

# 4. Problem Without Headless Architecture

If Agentic AI OS owns the interface:

- Applications become dependent on platform UI.
- Different products cannot customize experiences.
- Platform scope becomes unclear.
- Business logic becomes mixed with presentation logic.

The system would become an application instead of an operating system.

---

# 5. Alternatives Considered

## Option 1: Full Application Platform

Agentic AI OS provides:

- Frontend
- Backend
- AI services

### Advantages

- Faster initial demonstration.
- Single complete product.

### Disadvantages

- Limited flexibility.
- Strong UI coupling.
- Poor reuse across applications.

Rejected.

---

## Option 2: Shared UI Framework

Agentic AI OS provides reusable frontend components.

### Advantages

- Faster application development.
- Consistent design.

### Disadvantages

- Creates frontend dependency.
- Reduces application independence.

Not selected as the core approach.

---

## Option 3: Headless Core

Agentic AI OS provides only intelligence infrastructure.

### Advantages

- Maximum flexibility.
- Multiple clients.
- Clear responsibility boundaries.
- Easier scaling.

Selected.

---

# 6. Responsibility Separation

## Agentic AI OS Responsibilities

The platform owns:

- AI execution.
- Memory.
- Knowledge.
- Agents.
- Workflows.
- Tools.
- Provider management.
- Security.
- Observability.

---

## Application Responsibilities

Applications own:

- User interface.
- User experience.
- Product logic.
- Business rules.
- User-specific interactions.

---

# 7. Example

Home application:

```
User

↓

Home Interface

↓

Agentic AI OS SDK

↓

Memory + Agents + Knowledge

↓

AI Provider
```

The user never needs to know the underlying AI infrastructure.

---

# 8. Benefits

## Application Freedom

Each application can create a unique experience.

Example:

Home:

```
Emotional personal assistant
```

Bakery:

```
Business automation assistant
```

Sewa Bazaar:

```
Marketplace intelligence
```

All can use the same intelligence layer.

---

## Faster Evolution

The AI platform can improve independently.

New capabilities become available to all clients.

Example:

Adding:

- Better memory
- New providers
- New agents

benefits every connected application.

---

# 9. Consequences

## Positive Consequences

Provides:

- Clear boundaries.
- Reusable platform.
- Multiple application support.
- Independent development.
- Long-term flexibility.

---

## Negative Consequences

Requires:

- Strong API design.
- More responsibility for client applications.
- Additional integration work.

---

# 10. Implementation Impact

The repository should avoid:

- Frontend application code inside core.
- Product-specific UI logic.
- Application-specific business rules.

The core should expose capabilities, not experiences.

---

# 11. Future Extensions

Possible future additions:

- Admin dashboard.
- Developer portal.
- Monitoring interface.

These are platform management tools, not application interfaces.

---

# 12. Final Decision

Agentic AI OS will use a headless core architecture.

The platform provides intelligence infrastructure while client applications remain responsible for their own user experiences.

This keeps Agentic AI OS reusable across many products and prevents application-specific coupling.

---

# Related Documents

- ADR-001-modular-monolith.md
- ADR-002-api-first.md
- ADR-003-provider-abstraction.md
- api-spec.md
- sdk.md
- 02-high-level-architecture.md