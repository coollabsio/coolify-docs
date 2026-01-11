---
title: "Redis Insight"
description: "Here you can find the documentation for hosting Redis Insight with Coolify."
---

# Redis Insight

<ZoomableImage src="/docs/images/services/redisinsight-logo.png" />

## What is Redis Insight?

Redis Insight is the official GUI for Redis that lets you do both GUI- and CLI-based interactions in a fully-featured desktop GUI client. It provides intuitive tools for visualizing and optimizing data in Redis, making it easier to work with Redis databases through visual representations of your data structures, query performance analysis, and real-time monitoring.

## How to connect to redis deployed through Coolify?
### 1. Connect To Predefined Network 
<ZoomableImage src="/docs/images/services/redisinsight-guide1.webp" />
1. Go to the "General Configuration" page of Redis insight service
2. Enable the option "**Connect To Predefined Network**"

:::success Tip
From Coolify v4.0.0-beta.455 onward, this option is on by default.  
If you deployed Redis Insight earlier, manually enable "**Connect To Predefined Network**."
:::

### 2. Get Redis URL
<ZoomableImage src="/docs/images/services/redisinsight-guide2.webp" />
1. Go to the "General Configuration" page of Redis database you deployed through Coolify.
2. Copy the "**Redis URL (Internal)**" and use it as database URL on Redis Insight dashboard

## Links

- [The official website](https://redis.io/insight?utm_source=coolify.io)
- [Documentation](https://redis.io/docs/latest/operate/redisinsight?utm_source=coolify.io)
- [GitHub](https://github.com/RedisInsight/RedisInsight?utm_source=coolify.io)
