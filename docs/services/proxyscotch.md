---
title: Proxyscotch
description: "Run your own CORS proxy on Coolify. Works both standalone & with Hoppscotch"
---

# Proxyscotch

<ZoomableImage src="/docs/images/services/proxyscotch.png" alt="Proxyscotch (hoppscotch) logo" />

## What is Proxyscotch

Tiny open-source CORS proxy made by Hoppscotch.
> Works well with Hoppscotch, but can be used standalone as well.


## Setup Instructions
> This is only needed for when setting up Proxyscotch for a selfhosted instance of Hoppscotch.

If you secure your proxy server ***(recommended & enabled by default)*** you will need to set some ENV vars for your Hoppscotch instance.

##### After you've set up your Proxyscotch instance:

- Go and find the token that Coolify generated for you.
- In the settings for your Hoppscotch instance on coolify, go to **Environment Variables**
- Add a new variable called `VITE_PROXYSCOTCH_ACCESS_TOKEN` and set it to the token you found before.
- Restart the Hoppscotch instance.

- Once it restarts, load the webui & navigate to **Settings > Interceptors**. - Then scroll down to **Proxy**
- Set the proxy URL to the URL of your Proxyscotch instance
> You might have to enable the Proxy via the switch in the dashboard first before you can modify the URL.

You should now have Hoppscotch set-up & working with your own CORS proxy!

## Links

- [Official Documentation](https://github.com/hoppscotch/proxyscotch?utm_source=coolify.io)
