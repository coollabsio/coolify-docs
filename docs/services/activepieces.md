---
title: ActivePieces
description: "Deploy ActivePieces workflow automation platform on Coolify with TypeScript-based extensible automation, visual builder, and 100+ integrations."
# tabs:
#   - title: Overview & Requirements
#     content:
#       items:
#         - icon: 🔲
#           label: CPU
#           value: 2 Cores
#         - icon: 💾
#           label: RAM
#           value: 2 GB
#         - icon: 💿
#           label: Storage
#           value: 10 GB
#         - icon: 🌐
#           label: Network
#           value: IPv4 Address Required
#         - icon: 🖥️
#           label: Supported OS
#           value: All Linux-based distributions
#         - icon: 🌱
#           label: System Architecture
#           value: ARM64, AMD64 (x86_64)
#       message:
#         icon: 🌱
#         value: >-
#           It may take up to 5 minutes for the services to go healthy after
#           deployment. Please be patient and avoid assuming the services are not
#           working during this period.
#         type: info
#   - title: Default Credentials
#     content:
#       items:
#         - icon: 👤
#           label: Username
#           value: admin
#         - icon: 🔑
#           label: Password
#           value: admin
#   - title: External Links
#     content:
#       items:
#         - code: Official Website
#           description: "Deploy ActivePieces workflow automation platform on Coolify with TypeScript-based extensible automation, visual builder, and 100+ integrations."
#         - code: Official Documentation
#           description: https://www.activepieces.com/docs?utm_source=coolify.io
#         - code: GitHub Repository
#           description: https://github.com/activepieces/activepieces?utm_source=coolify.io
# compose:
#   services:
#     activepieces:
#       image: ghcr.io/activepieces/activepieces:latest
#       environment:
#         - SERVICE_FQDN_ACTIVEPIECESS
#         - AP_API_KEY=$SERVICE_PASSWORD_64_APIKEY
#         - AP_ENCRYPTION_KEY=$SERVICE_PASSWORD_ENCRYPTIONKEY
#         - >-
#           AP_ENGINE_EXECUTABLE_PATH=${AP_ENGINE_EXECUTABLE_PATH:-dist/packages/engine/main.js}
#         - AP_ENVIRONMENT=${AP_ENVIRONMENT:-prod}
#         - AP_EXECUTION_MODE=${AP_EXECUTION_MODE:-UNSANDBOXED}
#         - AP_FRONTEND_URL=${SERVICE_FQDN_ACTIVEPIECES}
#         - AP_JWT_SECRET=$SERVICE_PASSWORD_64_JWT
#         - AP_POSTGRES_DATABASE=${POSTGRES_DB:-activepieces}
#         - AP_POSTGRES_HOST=${POSTGRES_HOST:-postgres}
#         - AP_POSTGRES_PASSWORD=${SERVICE_PASSWORD_POSTGRES}
#         - AP_POSTGRES_PORT=${POSTGRES_PORT:-5432}
#         - AP_POSTGRES_USERNAME=$SERVICE_USER_POSTGRES
#         - AP_REDIS_HOST=${REDIS_HOST:-redis}
#         - AP_REDIS_PORT=${REDIS_PORT:-6379}
#         - AP_SANDBOX_RUN_TIME_SECONDS=${AP_SANDBOX_RUN_TIME_SECONDS:-600}
#         - AP_TELEMETRY_ENABLED=${AP_TELEMETRY_ENABLED:-false}
#         - >-
#           AP_TEMPLATES_SOURCE_URL=${AP_TEMPLATES_SOURCE_URL:-https://cloud.activepieces.com/api/v1/flow-templates}
#         - >-
#           AP_TRIGGER_DEFAULT_POLL_INTERVAL=${AP_TRIGGER_DEFAULT_POLL_INTERVAL:-5}
#         - AP_WEBHOOK_TIMEOUT_SECONDS=${AP_WEBHOOK_TIMEOUT_SECONDS:-30}
#       depends_on:
#         postgres:
#           condition: service_healthy
#         redis:
#           condition: service_started
#       healthcheck:
#         test:
#           - CMD
#           - curl
#           - '-f'
#           - http://127.0.0.1:80
#         interval: 5s
#         timeout: 20s
#         retries: 10
#     postgres:
#       image: postgres:latest
#       environment:
#         - POSTGRES_DB=${POSTGRES_DB:-activepieces}
#         - POSTGRES_PASSWORD=${SERVICE_PASSWORD_POSTGRES}
#         - POSTGRES_USER=${SERVICE_USER_POSTGRES}
#         - POSTGRES_PORT=${POSTGRES_PORT:-5432}
#       volumes:
#         - pg-data:/var/lib/postgresql/data
#       healthcheck:
#         test:
#           - CMD-SHELL
#           - pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}
#         interval: 5s
#         timeout: 20s
#         retries: 10
#     redis:
#       image: redis:latest
#       volumes:
#         - redis_data:/data
#       healthcheck:
#         test:
#           - CMD
#           - redis-cli
#           - ping
#         interval: 5s
#         timeout: 20s
#         retries: 10
---

<!-- <script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script> -->

<ZoomableImage src="/docs/images/services/activepieces0.webp" alt="Activepieces dashboard" />

## What is ActivePieces

Your friendliest open source all-in-one automation tool, designed to be extensible through a type-safe pieces framework written in Typescript.

## Visual Demos

<ZoomableImage src="/docs/images/services/activepieces1.gif" alt="Activepieces dashboard" />

<br />

<ZoomableImage src="/docs/images/services/activepieces2.gif" alt="Activepieces dashboard" />

<!-- ## Installation & Configuration

This section provides detailed information about installing and configuring ActivePieces in your environment. You'll find system requirements, credentials, environment variables, and useful external resources organized in tabs below. -->

<!-- <TabBlock   
  :tabs="frontmatter.tabs" 
  :compose="frontmatter.compose" 
/> -->
