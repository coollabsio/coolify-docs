---
title: "Ruflo"
description: "Multi-agent orchestration for Claude Code with ~200 MCP tools, swarm coordination, and a built-in chat UI."
og:
  description: "Run Ruflo on Coolify for self-hosted multi-agent AI orchestration: 200+ MCP tools across 11 toggleable groups, OpenAI-compatible bridge, and a chat UI."
category: "AI"
icon: "/docs/images/services/ruflo-logo.svg"
---

# What is Ruflo?

[Ruflo](https://github.com/ruvnet/ruflo) is an enterprise multi-agent
orchestration platform built on top of Anthropic's Claude. It exposes
~200 MCP tools across 11 toggleable groups (intelligence, agents,
memory, dev-tools, security, browser, neural, agentic-flow,
claude-code, gemini, codex), a self-hosted chat UI for end-users, and
an OpenAI-compatible MCP bridge for any tool that already speaks the
OpenAI API.

This template deploys the upstream four-service stack — MongoDB,
the MCP bridge, the chat UI, and an Nginx reverse proxy — wired up
with Coolify's magic envs so the user only ever pastes one provider
key.

## Required configuration

Set **at least one** provider key in Coolify's environment panel:

- `OPENAI_API_KEY` — for OpenAI models
- `GOOGLE_API_KEY` — for Gemini models
- `OPENROUTER_API_KEY` — for OpenRouter

`ANTHROPIC_API_KEY` is only required when `MCP_GROUP_CLAUDE_CODE=true`.

## MCP tool groups

The MCP bridge ships ~200 tools organized into 11 groups. Toggle each
on/off via env. **Default-on**: `MCP_GROUP_INTELLIGENCE`,
`MCP_GROUP_AGENTS`, `MCP_GROUP_MEMORY`, `MCP_GROUP_DEVTOOLS`.
**Opt-in**: `MCP_GROUP_SECURITY`, `MCP_GROUP_BROWSER`,
`MCP_GROUP_NEURAL`, `MCP_GROUP_AGENTIC_FLOW`, `MCP_GROUP_CLAUDE_CODE`,
`MCP_GROUP_GEMINI`, `MCP_GROUP_CODEX`.

## Brand customization

`BRAND_NAME` (default `RuFlo`) and `BRAND_DESCRIPTION` are passed to
the chat UI. Optional Google OIDC auth via `OPENID_PROVIDER_URL` /
`OPENID_CLIENT_ID` / `OPENID_CLIENT_SECRET`.

## Persistence

Two named volumes survive restarts:

- `mongo-data` → `/data/db` (chat history, users, settings)
- `mcp-bridge-state` → `/app/.claude-flow` (tasks, agent memory,
  swarm state)

## Links

- [Source repository](https://github.com/ruvnet/ruflo?utm_source=coolify.io)
- [Upstream docker-compose](https://github.com/ruvnet/ruflo/blob/main/ruflo/docker-compose.yml?utm_source=coolify.io)
- [Wiki and tool reference](https://github.com/ruvnet/ruflo/wiki?utm_source=coolify.io)
