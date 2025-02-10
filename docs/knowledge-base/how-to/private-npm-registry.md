---
title: "Private NPM Registry"
description: "A guide to setup private NPM registry with Coolify."
---

# Private NPM Registry
If you would like to use a private NPM registry with Coolify, you can do so by following the steps below.


1. Add `.npmrc` file to your project root with the following content:

```bash
//registry.npmjs.org/:_authToken=$NPM_TOKEN
```

2. Add the following environment variables to your project as a `build` variable:

```bash
NPM_TOKEN=your_npm_token
```

3. Deploy your application.
