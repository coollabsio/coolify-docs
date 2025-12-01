---
title: Rivet Engine
description: "Deploy Rivet Engine with Coolify for building and scaling stateful workloads with long-lived processes, durable state, and realtime capabilities."
---

# Rivet Engine
<br />
<ZoomableImage src="/docs/images/services/rivet-logo.svg" alt="Rivet Engine" />

## What is Rivet Engine?

Rivet Engine is the backend engine that powers Rivet Actors at scale. It's an optional component of the Rivet ecosystem that provides enterprise-grade infrastructure for running stateful workloads with long-lived processes, durable state, and realtime capabilities.

While you can use RivetKit (the TypeScript library) with a file system or memory driver for development, Rivet Engine provides production-ready infrastructure for:

- **Automatic scaling** from zero to millions of concurrent actors
- **Distributed state management** with fast, in-memory state storage
- **Actor lifecycle management** with hibernation and instant wake-up
- **Built-in resilience** with automatic failover and recovery
- **Edge deployment** for low-latency global distribution

Think of it as the production runtime that takes your RivetKit actors and scales them effortlessly across distributed infrastructure.

### Key Features

- **Production-Ready Scaling**: Automatically scale from zero to millions of concurrent actors with no cold starts
- **Distributed State Storage**: State is stored on the same machine as your compute for ultra-fast reads and writes with no database latency
- **Actor Lifecycle Management**: Actors automatically hibernate when idle and wake instantly on demand, only consuming resources when active
- **Built-In Realtime**: Native support for WebSockets and SSE for realtime state updates and broadcasting
- **Resilient Infrastructure**: Automatic failover and recovery with state integrity preservation
- **Edge-Ready**: Deploy actors close to users for instant interactions
- **Multi-Runtime Support**: Works with Node.js, Bun, Deno, and Cloudflare Workers
- **API Integration**: RESTful API for managing runners, actors, and namespaces
- **Built on Web Standards**: Uses standard HTTP, WebSockets, and SSE protocols

### Use Cases

Rivet Engine powers applications that require:

- **AI Agents**: Durable AI assistants with persistent memory and realtime streaming capabilities
- **Realtime Collaboration**: Collaborative documents, whiteboards, and tools with CRDTs and realtime synchronization
- **Durable Workflows**: Multi-step workflows with automatic state management and recovery
- **Local-First Applications**: Offline-first apps with server-side synchronization and conflict resolution
- **Chatbots & Automation**: Discord, Slack, or autonomous bots with persistent conversation state
- **Per-User Databases**: Isolated data stores for each user with zero-latency access
- **Multiplayer Games**: Authoritative game servers with realtime state synchronization
- **Background Processing**: Scheduled and recurring jobs without external queue infrastructure
- **Rate Limiting**: Distributed rate limiting with in-memory counters and state

### How It Works

Rivet Engine provides a backend runtime that:

1. **Manages Actors**: Coordinates actor lifecycle, hibernation, and wake-up across distributed infrastructure
2. **Handles State**: Stores actor state in memory for fast access, with persistent backup to storage backends
3. **Routes Requests**: Efficiently routes client requests to the correct actor instance
4. **Scales Dynamically**: Automatically spawns and destroys actor instances based on demand
5. **Ensures Resilience**: Monitors health and automatically recovers failed actors with state preservation

### Integration with RivetKit

Rivet Engine works seamlessly with RivetKit, the TypeScript library for building actors:

- **Development**: Use RivetKit with file system or memory drivers for local development
- **Production**: Deploy to Rivet Engine for automatic scaling and enterprise features
- **Self-Hosted**: Run Rivet Engine on your own infrastructure for full control
- **Managed**: Use Rivet Cloud for 1-click deployment with managed infrastructure

### Deployment Options

Deploy Rivet Engine on:

- **Self-Hosted** (Coolify, Docker, Kubernetes)
- **Cloud Platforms** (Vercel, Railway, AWS ECS, Google Cloud Run, Hetzner)
- **Rivet Cloud** (Managed, 1-click deployment)

### Storage Backends

Rivet Engine supports multiple storage backends for actor state:

- PostgreSQL
- File System
- Memory (development/testing)
- Custom storage adapters

## Links

- [Official website ↗](https://www.rivet.dev/?utm_source=coolify.io)
- [GitHub (Engine) ↗](https://github.com/rivet-dev/rivet?utm_source=coolify.io)
- [GitHub (RivetKit) ↗](https://github.com/rivet-dev/rivetkit?utm_source=coolify.io)
- [Documentation ↗](https://www.rivet.dev/docs/?utm_source=coolify.io)
- [Discord Community ↗](https://rivet.dev/discord?utm_source=coolify.io)
