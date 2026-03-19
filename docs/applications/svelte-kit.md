---
title: SvelteKit
description: Deploy SvelteKit applications on Coolify with static builds using adapter-static or Node server builds with adapter-node.
---

# SvelteKit

Svelte Kit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.

## Static build (`adapter-static`)

You need to use `@sveltejs/adapter-static` ([docs](https://kit.svelte.dev/docs/adapter-static)) adapter to build a static site.

1. Set your site to static `on` (under `Build Pack` section).
2. Set your `Publish Directory` to `/build`

## Node server (`adapter-node`)

You need to use `@sveltejs/adapter-node` ([docs](https://kit.svelte.dev/docs/adapter-node)) adapter to build a node server based SvelteKit app.

1. Set your site to static to `off` (under `Build Pack` section).
2. Set your `Install Command` to `npm install`.
3. Set your `Build Command` to `npm run build`.
4. Set your `Start Command` to `node build`.
5. Click `Save`.
6. In your Environment Variables tab, check the current Node version supported by Nix. In the example screenshot below, it's `version 22`.
<img width="787" height="599" alt="image" src="https://github.com/user-attachments/assets/de83f4ab-6403-47e7-b589-b6ab33a4de17" />
7. Add `engines` to your `package.json` with the Node version from your environment variables. For example
```JSON
{
	"name": "your-app",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"engines": {
		"node": ">=22",
...
	},
```
8. Git Commit
9. Click Deploy from your Coolify Dashboard
10. Add an Environment Variable ORIGIN with your app's actual domain. For example:
<img width="686" height="507" alt="image" src="https://github.com/user-attachments/assets/065fb028-03fc-4d3f-98a3-90eb7a0a1570" />

12. Optional, but recommended: Go to the Healthcheck tab and click `Enable Healthcheck`
<img width="760" height="389" alt="image" src="https://github.com/user-attachments/assets/ccd09570-404d-4c7d-8184-e963b12637bb" />
