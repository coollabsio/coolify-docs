---
title: "Terminal"
description: "Access Coolify resources through built-in web terminal with xterm.js, secure SSH connections, and Websocket communication for all containers and servers."
---

# Terminal

**Coolify** provides a powerful **built-in web terminal** that offers seamless access to all your resources directly from your browser. This feature enhances your ability to manage and interact with your infrastructure efficiently.

Key features:

1. **Universal Access**: Available for all resources **managed by Coolify**. Any containers or servers.
2. **Supports colors, text editing, and more**: Uses [xterm.js](https://xtermjs.org/) under the hood, so you get a fully featured terminal experience.
3. **Eliminates the need for external SSH clients**: This integrated terminal eliminates the need for external SSH clients or complex connection setups, streamlining your workflow and improving productivity.

#### Is it secure?

Yes, it is. The terminal commands are executed within the Coolify environment and through a secure SSH connection, so you can be sure that your commands are executed securely.

#### How to access?

You can access the terminal from the sidebar.

#### How does it works **exactly**?

The terminal is a web-based interface that allows you to interact with your resources using a terminal emulator and the web-to-terminal communication is passed through a Websocket connection.

After that, it creates a new process on the Terminal server (inside Coolify's realtime container) and connects to your main Coolify instance container, via SSH. 

But the connection is not direct, it goes first through a Websocket connection, requiring an authentication to do so, after that, the connection is established inside Coolify's main Instance (host server), to make sure that we have the permissions to access the resources.

And then, the process inside the Coolify's main Instance container, establishes a new SSH connection to the target resource (container or server). Lets see a diagram explaining it better:

![terminal-diagram](/images/terminal/terminal-diagram.webp)