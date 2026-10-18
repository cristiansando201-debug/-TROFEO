# TROFEO Architecture

## Overview

TROFEO is a full-stack AI creative platform built on Next.js 16 App Router.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   TROFEO CORE                       │
│                                                     │
│  User → Next.js App → AI Provider → Response       │
└─────────────────────────────────────────────────────┘

Frontend (Next.js App Router)
├── / (Homepage)
├── /workspace (Main Chat + Workspace)
├── /login
├── /register
├── /projects
└── /settings

API Layer
├── POST /api/chat          (SSE streaming)
├── GET/POST /api/conversations
├── GET/POST /api/projects
├── POST /api/auth/register
└── GET/POST /api/auth/[...nextauth]

AI Provider Abstraction
├── DemoProvider (no API key)
├── OpenAIProvider
├── AnthropicProvider
├── GoogleProvider
└── OllamaProvider (local)

Data Layer
├── PostgreSQL (Prisma ORM)
│   ├── users, accounts, sessions
│   ├── conversations, messages
│   ├── projects, project_files
│   ├── memories
│   └── usage, settings
└── Redis (optional)
    ├── Rate limiting
    ├── Session cache
    └── Short-term memory

Auth Layer (NextAuth v5)
├── Credentials (email/password)
└── Google OAuth (optional)
```

## AI Provider Flow

```
Request
  ↓
createAIProvider() [factory, reads AI_PROVIDER env]
  ↓
Provider.stream() or Provider.chat()
  ↓
SSE chunks → frontend
  ↓
Message saved to DB
```

## Agent Architecture (Future)

```
User Intent
  ↓
TROFEO CORE (Intent Detection)
  ↓
Agent Router
  ↓
Specialized Agent (Games | Studio | Social | Commerce | Search | Business)
  ↓
Tools (DB | Search | Image | Voice | External APIs)
  ↓
Response
```
