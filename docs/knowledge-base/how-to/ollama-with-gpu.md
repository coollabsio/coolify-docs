---
title: "Ollama with GPU"
description: "Self-host Ollama LLM with NVIDIA GPU acceleration on Coolify including hardware requirements, Docker configuration, and model management setup."
---

# Ollama with GPU
Based on the detailed guide from [geek.sg](https://geek.sg/blog/how-i-self-hosted-llama-32-with-coolify-on-my-home-server-a-step-by-step-guide?ref=coolify.io):

1. **Hardware Requirements**
   - A server with NVIDIA GPU (tested with RTX 3060 12GB)
   - Minimum 32GB RAM recommended
   - Sufficient storage space for models

2. **Software Setup**
   - Install NVIDIA drivers
   - Install NVIDIA Container Toolkit
   - Configure Docker to use NVIDIA runtime

3. **Coolify Configuration**
   - Deploy Ollama through Coolify's one-click installer
   - Modify the Docker compose configuration to include GPU support
   - Add required environment variables for GPU acceleration

4. **Model Management**
   - Pull and manage your preferred LLM models
   - Monitor GPU usage and performance
   - Adjust model parameters as needed

For the complete detailed guide, visit the [original article](https://geek.sg/blog/how-i-self-hosted-llama-32-with-coolify-on-my-home-server-a-step-by-step-guide?ref=coolify.io).

