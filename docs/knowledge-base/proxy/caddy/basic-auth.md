---
title: Caddy Basic Auth
description: "Add password protection to Coolify applications with Caddy basic authentication using hash-password CLI for secure credential management."
---

# Caddy Basic Auth

Basic authentication provides an extra layer of security for your applications by requiring a username and password to access protected resources.

With Coolify, you can easily integrate basic auth into your Caddy web server configuration.

## Why Use Basic Auth with Caddy?

1. **Enhanced Security:** Adds an extra barrier to prevent unauthorized access.
2. **Simplicity:** Straightforward configuration that integrates directly into your Caddy setup.
3. **Flexibility:** Configure different credentials for different services as needed.

## 1. Generate a Hashed Password

For Caddy to validate credentials securely, your password must be hashed using Caddy's built-in tool. The basic auth credential is set as:

```sh
caddy_0.basicauth.<username>="<hashed_password>"
```

The `<hashed_password>` **must be generated with the Caddy CLI** using the `caddy hash-password` command.

### How to Generate a Hashed Password

1. Open your terminal.
2. Run the following command:

   ```sh
   caddy hash-password --plaintext "your_plaintext_password"
   ```

   Replace `"your_plaintext_password"` with your actual password.

3. The output will be a hashed password that you can use directly in your Caddy configuration.

For more details and advanced options (like choosing a different algorithm), refer to the [Caddy CLI documentation](https://caddyserver.com/docs/command-line#caddy-hash-password?utm_source=coolify.io).

## 2. Configure Basic Auth in Coolify

Once you have your hashed password, integrate it into your Coolify configuration.

1. **Add the Basic Auth Entry:**

   - Add the following line to the Caddyfile of the application where you want to enable basic authentication:
     ```sh
     caddy_0.basicauth.<username>="<hashed_password>"
     ```
     - Replace `<username>` with your desired username and `<hashed_password>` with the output from the `caddy hash-password` command:

2. **Apply the Configuration:**
   - Save your configuration changes.
   - Restart your application to apply the new settings.

::: warning Note
Make sure that your hashed password is generated **only** using the Caddy CLI.

Using an unrecognized hash method may result in authentication failures.
:::
