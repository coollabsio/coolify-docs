---
title: Docker Installation Failed
description: Fix Docker installation failures during Coolify setup by using Ubuntu LTS versions or manually installing Docker 24+ on non-LTS operating systems.
---

# Docker Installation Failed
If the Coolify install script fails at the **“Installing Docker”** step, it’s most often due to the server running a **non-LTS version of the operating system** — especially common on **Ubuntu** systems.

## Symptoms
Coolify install script fails with an error like:
```sh
ERROR: '27.0' not found amongst apt-cache madison results
```

## Solution
- Manually Install Docker
   -  Follow the official [Docker installation guide](https://docs.docker.com/engine/install/#server) to manually install Docker (version **24+**)

OR
   
- Use an LTS Version of Your OS
   -  Switch to a **Long-Term Support (LTS)** version of your operating system, such as **Ubuntu 22.04 LTS** or  **Debian 12**
