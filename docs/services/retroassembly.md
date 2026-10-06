---
title: "RetroAssembly"
description: "Deploy your personal web-based retro game cabinet in Coolify."
---

<ZoomableImage src="/docs/images/services/retroassembly-logo.png" alt="RetroAssembly dashboard" />

# What is RetroAssembly?

**RetroAssembly** is a self-hosted, web-based personal retro game cabinet. It allows you to transform your ROM collection into a playable library accessible from any browser. It uses [Nostalgist.js](https://nostalgist.js.org/) (Libretro) to emulate classic consoles like NES, Genesis, and Arcade directly in the client, meaning no heavy processing happens on your server, it just serves the files and manages your saves.

## Info

RetroAssembly is extremely lightweight because the emulation happens in the user's browser (client-side). Your server mainly handles file storage, metadata fetching, and database management.

### Persistence

To keep your library and progress safe, you **must** mount a persistent volume to `/app/data`. This directory houses your SQLite database (`db.sqlite`), your uploaded ROMs, and the automatically fetched box art.

## Features

- **Automatic Scraping**: Upload a ROM and RetroAssembly automatically finds the correct box art and game info.
- **Cloud Saves**: Your save states and in-game saves are stored on your server and synced across devices.
- **Controller Support**: Plug-and-play support for standard USB and Bluetooth gamepads.
- **Library Management**: Easily upload, delete, or categorize your games through the web UI.

# Screenshots

<ZoomableImage src="/docs/images/services/retroassembly-home.jpg" />

<ZoomableImage src="/docs/images/services/retroassembly-games.jpg" />

## Links

- [Official Website](https://retroassembly.com/)
- [GitHub](https://github.com/arianrhodsandlot/retroassembly)
- [Docker Hub](https://hub.docker.com/r/arianrhodsandlot/retroassembly)
