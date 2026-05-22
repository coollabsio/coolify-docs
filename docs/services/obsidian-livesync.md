---
title: "Obsidian LiveSync"
description: "Self-hosted sync backend for the Obsidian LiveSync plugin using CouchDB."
og:
  description: "Deploy a self-hosted Obsidian LiveSync server on Coolify to privately sync your Obsidian vaults across all devices using CouchDB."
category: "Storage"
---

<img src="/docs/images/services/obsidian-livesync.svg" alt="Obsidian LiveSync" width="150" />

## What is Obsidian LiveSync?

Obsidian LiveSync is a self-hosted synchronization backend for the [LiveSync community plugin](https://github.com/vrtmrz/obsidian-livesync?utm_source=coolify.io) for [Obsidian](https://obsidian.md/?utm_source=coolify.io). It uses CouchDB as the underlying database to sync your Obsidian vaults in real time across multiple devices — desktop, mobile, or any platform where Obsidian runs.

Unlike the official Obsidian Sync service, LiveSync lets you keep full control of your data by running the sync server on your own infrastructure. All note content is stored in your CouchDB instance and never passes through a third-party server.

## How It Works

The Coolify service deploys a pre-configured CouchDB instance with CORS enabled for Obsidian's app origins (`app://obsidian.md`, `capacitor://localhost`, `http://localhost`). Once deployed, you point the LiveSync plugin in Obsidian to your server URL and credentials to start syncing.

## Configuration

After deploying the service in Coolify:

1. Open Obsidian and install the **Self-hosted LiveSync** plugin from the community plugins list.
2. In the plugin settings, select **Remote Database** and choose **CouchDB**.
3. Enter the service URL (the domain Coolify assigned, e.g. `https://your-domain.example.com`).
4. Enter the username and password — find them in Coolify under **Environment Variables** (`COUCHDB_USER` and `COUCHDB_PASSWORD`).
5. Click **Test Database Connection** to verify the setup.
6. Enable **LiveSync** or **Periodic Sync** mode to start syncing.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `COUCHDB_USER` | auto-generated | CouchDB admin username |
| `COUCHDB_PASSWORD` | auto-generated | CouchDB admin password (64-char) |
| `MAX_DOCUMENT_SIZE` | `52428800` (50 MB) | Maximum size of a single CouchDB document in bytes |
| `MAX_HTTP_REQUEST_SIZE` | `67108864` (64 MB) | Maximum HTTP request size in bytes — should exceed `MAX_DOCUMENT_SIZE` to allow multipart overhead |

Increase `MAX_DOCUMENT_SIZE` and `MAX_HTTP_REQUEST_SIZE` only if you attach very large files to your notes.

## Links

- [LiveSync plugin GitHub](https://github.com/vrtmrz/obsidian-livesync?utm_source=coolify.io)
- [Setup guide for self-hosted server](https://github.com/vrtmrz/obsidian-livesync/blob/main/docs/setup_own_server.md?utm_source=coolify.io)
- [Obsidian website](https://obsidian.md/?utm_source=coolify.io)
- [CouchDB documentation](https://docs.couchdb.org/?utm_source=coolify.io)
