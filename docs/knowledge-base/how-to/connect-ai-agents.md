---
title: Connect AI Agents to the Coolify API
description: A short guide for wiring up your AI agents to Coolify's HTTP API.
---

# Connect AI Agents to the Coolify API

If you'd like an AI agent to interact with the Coolify API, for
example to help troubleshoot an infrastructure issue, this guide
shows you how.


## 1. Install the Prerequisites

On the machine where the agent will run, we'll install the
Latchkey tool. That will allow the agent to send authenticated
HTTP requests to the API without leaking any secrets to prompts.

1. Make sure your system has a working `node` installation. If not, you can download it from the [official page](https://nodejs.org/en/download).
2. Install Latchkey:

    ```bash
    npm install -g latchkey
    ```

## 2. Generate and Configure the API Token

1. Follow the [documentation for API token generation](https://coolify.io/docs/api-reference/authorization#generate).
   - For exploratory tasks, a read-only token is enough and safer. Use a full-access token only when the agent needs to create or modify resources.
2. Point Latchkey to your instance, for example:

    ```bash
    latchkey services register my-coolify \
        --service-family coolify \
        --base-api-url=http://203.0.113.1:8000/api/v1
    ```

3. Insert the API token:

    ```bash
    latchkey auth set my-coolify -H "Authorization: Bearer <your_token>"
    ```

## 3. Configure the AI Agent

Using `skills.sh`:

```bash
npx skills add imbue-ai/latchkey
```

You can also configure the AI agent manually. The exact steps
will differ depending on the agent. Taking OpenCode as an example:

```bash
mkdir -p ~/.opencode/skills/latchkey
latchkey skill-md > ~/.opencode/skills/latchkey/SKILL.md
```


## 4. Use the AI Agent

After completing the previous steps, you should now be able to
use your AI agent of choice to work with Coolify! Here are some
example questions and tasks for the agent:

> We're consolidating to fewer servers. Which one would be the easiest to decommission?

or

> Are any of our Coolify databases running outdated versions?

or even

> I need to test something. Spin up a temporary PostgreSQL database and give me the connection string. 

From here, it's up to your imagination.
