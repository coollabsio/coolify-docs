---
title: "IPAllowList"
description: "Restrict access to your coolify applications with Traefik IPAllowList middleware."
---

# IPAllowList
The `IPAllowList` is a Traefik middleware which allows you to restrict access to your coolify projects.
### Instructions
The middleware is activated if a valid ip is entered in the `Network allow list` option below network in the project settings.
- To activate the middleware, add the IPs in a comma separated list: 
`192.168.1.100, 192.168.1.188/32`
- To remove the middleware, simply clear the input field. 

::: info
The middleware supports plain IPs `192.168.1.1` or IPs + CIDR `192.168.1.1/24`. Incorrect IPs or CIDRs will be removed from the list without any notice.

You can validate that the middleware is activated by checking the `Container Labels` in the bottom of the settings where it adds the line:

```bash
traefik.http.middlewares.test-ipallowlist.ipallowlist.sourcerange={YOUR_LIST}
```
:::

