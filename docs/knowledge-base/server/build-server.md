---
title: "Build Server"
description: "A guide on how to use a build server with Coolify"
---

# Build Server
You could have a build server to build your projects on instead of building them on the server where you host your resources. This does not include Docker builds as much as npm build.

This keeps the load separated, so it does not affect your application's performance.

## Requirements

- The built images needs to be pushed to a container registry.
- The server needs to be authenticated to the container registry. See [this](/knowledge-base/docker/registry) for more information.
- The server needs to have access to the source code.
- The server needs Docker Engine installed.
- The server should be the same architecture as the deployment servers.

If you have more than one build server, the used server will be chosen randomly.

## How to use

1. Add a new server to Coolify.
2. Enable the `Build Server` feature while creating a new resource.

After this, Coolify will use this server to build your resources, in case you enabled the `Build Server` feature for them.

## How to set a build server for a resource

1. Create or go to a resource that you want to use a build server for.
2. Enable the `Build Server` feature on the `General` tab, `Build` section.
3. Make sure you set up a container registry for the resource.
