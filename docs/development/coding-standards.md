# Coding Standards

**Version:** 1.0

**Status:** Draft

**Last Updated:** 2026-07-27

**Owner:** Architecture Team

---

# 1. Purpose

This document defines coding standards and engineering conventions for Agentic AI OS.

The purpose is to maintain:

- Consistent code quality.
- Long-term maintainability.
- Clear architecture boundaries.
- Easier collaboration.
- Reliable system evolution.

All contributors and AI coding assistants must follow these standards.

---

# 2. General Principles

Development must follow these principles:

## Simplicity Over Cleverness

Code should be easy to understand.

Avoid:

- unnecessary abstractions
- complex solutions
- premature optimization

Prefer:

- clear logic
- readable structure
- maintainable design

---

## Single Responsibility

Each module, class, and function should have one clear responsibility.

Avoid:

```
UserService

- Authentication
- Email sending
- Database migration
- File processing
```

Prefer:

```
AuthenticationService

EmailService

FileService
```

---

## Explicit Over Implicit

Code behavior should be obvious.

Avoid hidden side effects.

Prefer:

- clear parameters
- clear return values
- documented behavior

---

# 3. Language Standards

Primary backend language:

```
TypeScript
```

Requirements:

- Strict TypeScript mode enabled.
- Avoid unnecessary `any`.
- Use interfaces for contracts.
- Use types for data structures.

---

# 4. Naming Conventions

## Files

Use:

```
kebab-case
```

Examples:

```
provider-service.ts

memory-controller.ts

workflow-engine.ts
```

---

## Variables and Functions

Use:

```
camelCase
```

Examples:

```typescript
const userId;

function createMemory();
```

---

## Classes and Interfaces

Use:

```
PascalCase
```

Examples:

```typescript
class MemoryService

interface ProviderAdapter
```

---

## Constants

Use:

```
UPPER_SNAKE_CASE
```

Example:

```typescript
MAX_RETRY_COUNT
```

---

# 5. Module Structure

Each module should follow consistent organization.

Example:

```
modules/

memory/

├── controllers/

├── services/

├── repositories/

├── interfaces/

├── schemas/

├── tests/

└── index.ts
```

---

# 6. Dependency Rules

Modules must communicate through defined interfaces.

Avoid:

```
Memory Module

↓

Direct Database Access

↓

Knowledge Tables
```

Prefer:

```
Memory Module

↓

Knowledge Interface

↓

Knowledge Service
```

---

# 7. Error Handling

Errors must be:

- predictable
- typed
- documented

Avoid:

```typescript
throw new Error("Something failed");
```

Prefer:

```typescript
throw new ProviderError(
    "Provider unavailable"
);
```

---

# 8. Validation

All external input must be validated.

Sources include:

- API requests
- User input
- Tool input
- Configuration values

Preferred validation:

```
Zod
```

---

# 9. Configuration Management

Configuration must:

- come from environment variables
- be validated
- have defaults where appropriate

Never:

- hardcode secrets
- hardcode provider keys
- store environment-specific values in code

---

# 10. Database Standards

Database access must use:

```
Controller

↓

Service

↓

Repository

↓

Database
```

Avoid:

- database queries inside controllers
- direct database access from agents
- duplicated queries

---

# 11. API Standards

All APIs must have:

- validation schemas
- documented responses
- consistent errors
- authentication rules

API contracts must be documented before implementation.

---

# 12. Logging Standards

Logs should provide useful operational information.

Include:

- request ID
- operation name
- execution status
- errors
- timing information

Never log:

- passwords
- API keys
- sensitive user information

---

# 13. Comments and Documentation

Comments should explain:

- why something exists
- architectural decisions
- complex reasoning

Avoid comments that only repeat code.

Bad:

```typescript
// Create user
createUser();
```

Good:

```typescript
// User creation happens here because identity ownership
// must be established before resource allocation.
```

---

# 14. Testing Standards

Production code should include tests.

Required:

- Unit tests for business logic.
- Integration tests for APIs.
- Module tests for critical systems.

---

# 15. AI Generated Code Rules

AI assistants may generate code, but generated code must:

- follow architecture.
- pass review.
- include tests.
- avoid unnecessary dependencies.
- match existing patterns.

AI-generated code is not automatically approved.

---

# 16. Security Standards

Code must:

- validate inputs.
- protect secrets.
- enforce permissions.
- avoid unsafe execution.

Security decisions must follow:

```
security.md
```

---

# 17. Git Standards

Commits should be:

- small
- focused
- descriptive

Example:

Good:

```
Add provider abstraction interface
```

Bad:

```
update stuff
```

---

# 18. Code Review Requirements

Before merging:

Review:

- Architecture compliance.
- Security impact.
- Test coverage.
- Performance impact.
- Documentation updates.

---

# 19. Final Rule

The goal is not the smallest amount of code.

The goal is a system that can evolve for years without becoming unmaintainable.

Agentic AI OS prioritizes:

- clarity
- reliability
- modularity
- long-term sustainability

---

# Related Documents

- development-guidelines.md
- testing-strategy.md
- security.md
- architecture documents
- ADR documents