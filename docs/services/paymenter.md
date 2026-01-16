---
title: "Paymenter"
description: "Host Paymenter billing on Coolify for web hosting invoicing, client management, automated provisioning, and service provider administration."
---

<ZoomableImage src="/docs/images/services/paymenter-logo.svg" alt="Paymenter dashboard" />

## What is Paymenter?

Paymenter is an open-source billing platform tailored for hosting companies. It simplifies the management of hosting services, providing a seamless experience for both providers and customers. Built on modern web technologies, Paymenter offers a flexible and robust solution for your hosting business needs.

## How to configure Paymenter with Coolify

1. Create a new resource using the **Paymenter** service.
2. Start the resource.
3. Set the correct app URL via the terminal:

Select the Paymenter container and run the following command:

```bash
php artisan app:init
```

4. Create the first admin user:
   ```bash
   php artisan app:user:create
   ```

## Links

- [The official website](https://paymenter.org/)
- [GitHub](https://github.com/Paymenter/Paymenter)
- [Demo](https://demo.paymenter.org/)
