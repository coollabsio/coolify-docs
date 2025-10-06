---
title: AnythingLLM
description: "Run AnythingLLM on Coolify for all-in-one AI application with RAG, AI agents, document chat, and multi-model support without infrastructure hassle."
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
#           description: "Run AnythingLLM on Coolify for all-in-one AI application with RAG, AI agents, document chat, and multi-model support without infrastructure hassle."
#         - code: Official Documentation
#           description: https://www.activepieces.com/docs?utm_source=coolify.io
#         - code: GitHub Repository
#           description: https://github.com/activepieces/activepieces?utm_source=coolify.io
# compose:
#   services:
#     anything-llm:
#       image: mintplexlabs/anythingllm
#       environment:
#         - SERVICE_FQDN_ANYTHINGLLM_3001
#         - STORAGE_DIR=/app/server/storage
#         - DISABLE_TELEMETRY=${DISABLE_TELEMETRY:-true}
#         - PASSWORDLOWERCASE=${PASSWORDLOWERCASE:-1}
#         - PASSWORDMAXCHAR=${PASSWORDMAXCHAR:-250}
#         - PASSWORDMINCHAR=${PASSWORDMINCHAR:-6}
#         - PASSWORDNUMERIC=${PASSWORDNUMERIC:-1}
#         - PASSWORDREQUIREMENTS=${PASSWORDREQUIREMENTS:-1}
#         - PASSWORDSYMBOL=${PASSWORDSYMBOL:-1}
#         - PASSWORDUPPERCASE=${PASSWORDUPPERCASE:-1}
#         - SIG_KEY=${SERVICE_PASSWORD_SIGKEY}
#         - SIG_SALT=${SERVICE_PASSWORD_SIGSALT}
#         - JWT_SECRET=${SERVICE_PASSWORD_JWTSECRET}
#         - AUTH_TOKEN=${SERVICE_PASSWORD_AUTHTOKEN}
#         - SERVER_PORT=${SERVER_PORT:-3001}
#       cap_add:
#         - SYS_ADMIN
#       volumes:
#         - anythingllm-storage:/app/server/storage
#         - anythingllm-hot:/app/collector/hotdir
#         - anythingllm-outputs:/app/collector/outputs
#       user: ${UID:-1000}:${GID:-1000}
---

<!-- <script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script> -->

# AnythingLLM

![AnythingLLM](/images/services/anythingllm.webp)

## What is AnythingLLM?

AnythingLLM is the easiest to use, all-in-one AI application that can do RAG, AI Agents, and much more with no code or infrastructure headaches.

## Screenshots

![AnythingLLM](/images/services/anythingllm.gif)

<!-- <TabBlock   
  :tabs="frontmatter.tabs" 
  :compose="frontmatter.compose" 
/> -->

## Links

- [The official website ›](https://www.anythingllm.com?utm_source=coolify.io)
- [GitHub ›](https://github.com/Mintplex-Labs/anything-llm?utm_source=coolify.io)