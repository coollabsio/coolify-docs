---
head:
  - - meta
    - name: description
      content: Coolify Documentation
  - - meta
    - name: keywords
      content: coolify self-hosting docker kubernetes vercel netlify heroku render digitalocean aws gcp azure
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: "@coolifyio"
  - - meta
    - name: twitter:title
      content: Coolify Documentation
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://coolify.io
  - - meta
    - property: og:title
      content: Coolify
  - - meta
    - property: og:description
      content: Self-hosting with superpowers.
  - - meta
    - property: og:site_name
      content: Coolify
  - - meta
    - property: og:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
---

# DNS Settings

To use custom domains with Coolify, you need to configure your DNS settings.

In general you need an `A` record for all the domains or subdomains you want to use, pointing to the IP address of your server where you would like to deploy your application.

Note that you can use the same IP address for multiple domains and subdomains.


## Single Domain
Let's say you want deploy your resource to `example.com` with the IP address `1.1.1.1`.

- You need to set an `A` record for `example.com` pointing to `1.1.1.1`.

:::tip
You can also add `www.example.com` as an `A` record and redirect it inside Coolify with the chosen reverse proxy.
:::

Then you can use `https://example.com` as a FQDN (Fully Qualified Domain Name) for any of your resources, even for your Coolify instance.

## Wildcard Domains
Let's say you want deploy your resource to `*.example.com` with the IP address `1.1.1.1`.

- You need to set an `A` record for `*.example.com` pointing to `1.1.1.1`.

This allows you to use any subdomain of `example.com` as a FQDN (Fully Qualified Domain Name) for any of your resources, even for your Coolify instance.

For example, you can use `https://app.example.com` or `https://api.example.com` as a FQDN.

## Autogenerated Domains
If you set a wildcard domain in your DNS settings, you can also use Coolify to autogenerate domains for your resources.
You just need to go to the `Server` settings and set the `Wildcard Domain` field to your domain, for example `https://example.com`.

Then if you create a new resource:
- You will get a random subdomain for your application, for example `https://random.example.com`.
- Also for your Preview Deployments, for example `https://<PRId>.random.example.com`.

:::tip
The Preview URL template could be modified in the application's page / `Preview Deployments` tab.
:::

## Instance Domain

If you self-host Coolify, you can set your Coolify instance a custom domain in the `/settings` page.