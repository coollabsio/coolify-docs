---
title: "Bluesky PDS"
description: "Host a Bluesky Personal Data Server with Coolify"
---

# Bluesky PDS

<ZoomableImage src="/docs/images/services/bluesky.svg" alt="Bluesky logo" />

## What is a Bluesky PDS?

Bluesky PDS (Personal Data Server) is a self-hosted data server that stores your data in the AT Protocol network. It allows you to control your own social media data and identity while still participating in the AT Protocol network. The PDS handles user accounts, posts, followers, and other social data in a decentralized manner.

## Setting a domain with https if already not set

Pdsadmin requires you to have https in your Bluesky PDS, make sure you have set a domain with https in the Coolify UI and check the environment variables so it matches it.

## Creating an account in your PDS

To create an account and start using your PDS, you can use the following pdsadmin commands in the Terminal tab of the Coolify UI:

```bash
pdsadmin create-invite-code
```

or

```bash
pdsadmin account create <email> <handle>
```

To check for other available commands in pdsadmin, you can simply run `pdsadmin`

## Setting up mail

Mailing is important for a Bluesky PDS, it's needed to confirm email, and other things!

You need to edit 2 environment variables in the Coolify UI, head to the Environment Variables tab and look for the `PDS_EMAIL_FROM_ADDRESS`, what you need to fill here is pretty much self explanatory, is the email address that's going to be used when sending an email, for example: `user@domain.com`

The next environment variable is `PDS_EMAIL_SMTP_URL`, this one is not very self explanatory, but here's how to fill it:

There are many ways to fill this variable, here are some examples:

`smtps://user%40example.com:password@mail.example.com:465` (SMTP with SSL)

`smtp://user%40example.com:password@mail.example.com:587` (SMTP without SSL)

`smtps://resend:<your Resend api key>@smtp.resend.com:465` (Resend)

You might need to URL-encode your username and password for the Mail Setup to work.

And that's it, your PDS should be ready for you to use, it will work like any other PDS!

## Links

- [The official website](https://blueskyweb.xyz?utm_source=coolify.io)
- [GitHub](https://github.com/bluesky-social/pds?utm_source=coolify.io)
