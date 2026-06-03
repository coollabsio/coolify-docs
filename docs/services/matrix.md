---
title: "Matrix (Synapse)"
description: "Run a Matrix Synapse homeserver on Coolify for decentralized, end-to-end encrypted chat with federation, SSO, registration, guests and VoIP."
---

# Matrix (Synapse)

<ZoomableImage src="/docs/images/services/matrix-logo.svg" alt="Matrix dashboard" />

## What is Matrix?

Matrix is an open-source, decentralized communication protocol for secure, real-time
communication: end-to-end encrypted messaging, voice and video calls, file sharing and
room-based conversations. It's a federated alternative to Slack or Discord, and
different Matrix servers can talk to each other.

[Synapse](https://github.com/element-hq/synapse) is the reference Matrix homeserver,
maintained by [Element](https://element.io/). It's what these Coolify templates run.

## Deployment variants

Coolify ships two Synapse templates with an **identical feature set**. The only
difference is the database:

- **Matrix Synapse with PostgreSQL** *(recommended for production)*: Synapse and a
  PostgreSQL container.
- **Matrix Synapse with SQLite**: a single Synapse container with an embedded SQLite
  database. Great for testing or small/personal servers.

Both deploy with sensible defaults: set `SYNAPSE_SERVER_NAME` and you have a working
homeserver. Every other capability below is enabled by simply filling in its
environment variable. Leave a variable empty to keep that feature off.

<Callout type="danger" title="SYNAPSE_SERVER_NAME is permanent">
`SYNAPSE_SERVER_NAME` becomes part of every user ID (`@user:SERVER_NAME`) and room
alias. It **cannot be changed after the first deployment** without invalidating all
existing identities. Choose it carefully before you first deploy.
</Callout>

## Server name vs. the domain you host on

Two different things, and getting them right up front avoids pain later:

- **Server name** (`SYNAPSE_SERVER_NAME`): the identity in user IDs, e.g. `example.org`
  produces `@alice:example.org`.
- **Service domain**: where Synapse actually runs, e.g. `matrix.example.org`.

### Recommended setup

- Server name: `example.org`
- Service domain (set in Coolify → Domains): `matrix.example.org`

This lets users be `@alice:example.org` while Synapse is hosted on the subdomain.

### Delegation (required for the split above)

Because Synapse runs on `matrix.example.org` but identifies as `example.org`, other
servers and clients must be told where to find it. Serve these two files on
**`https://example.org`** (the server-name domain, *not* the Synapse subdomain):

`/.well-known/matrix/server` for federation discovery:
```json
{ "m.server": "matrix.example.org:443" }
```

`/.well-known/matrix/client` for client discovery:
```json
{ "m.homeserver": { "base_url": "https://matrix.example.org" } }
```

<Callout type="info" title="Why these are manual">
Synapse can self-serve `/.well-known/matrix/server` (`serve_server_wellknown: true`,
enabled in the template), but only when `https://<server-name>` itself routes to
Synapse. In the recommended split-domain setup the files must live on `example.org`,
so you host them yourself (a tiny static site, your existing web server, or a Coolify
static resource). If your server name and service domain are the **same** host, no
delegation is needed.
</Callout>

## Features (all optional, via environment variables)

| Variable(s) | What it enables |
|---|---|
| `ENABLE_REGISTRATION=true` | Allow users to self-register |
| `ENABLE_GUESTS=true` | Allow guest access |
| `RECAPTCHA_PUBLIC_KEY` + `RECAPTCHA_PRIVATE_KEY` | Google reCAPTCHA on registration |
| `SMTP_HOST` (+ `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) | Email for verification, password resets, notifications |
| `OIDC_ISSUER` + `OIDC_CLIENT_ID` + `OIDC_CLIENT_SECRET` | Single sign-on via OIDC (Authentik, Keycloak, Pocket ID, and others) |
| `OIDC_ALLOW_EXISTING_USERS=true` | Link an SSO login to an existing local account (see below) |
| `TURN_URI` + `TURN_SHARED_SECRET` | Voice/video calls via an external TURN server |
| `ALLOW_PUBLIC_ROOMS_OVER_FEDERATION=true` | Expose your public room directory to other servers |
| `MAX_UPLOAD_SIZE` | Max media upload size (default `50M`) |
| `SYNAPSE_CONFIG_APPEND` | Advanced: raw YAML appended verbatim to `homeserver.yaml` |

An admin account is auto-created on first start from `SERVICE_USER_ADMIN` /
`SERVICE_PASSWORD_ADMIN`.

### Single sign-on (OIDC)

Set `OIDC_ISSUER`, `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` from your identity
provider. The redirect/callback URL to register in your IdP is:

```
https://<your-matrix-domain>/_synapse/client/oidc/callback
```

By default SSO maps the IdP's `preferred_username` to the Matrix localpart and creates
an account on first login.

<Callout type="warning" title="Adding SSO to a server that already has accounts">
Without `OIDC_ALLOW_EXISTING_USERS=true`, a first SSO login creates a **brand-new**
account instead of logging into the matching existing one. Set
`OIDC_ALLOW_EXISTING_USERS=true` so an SSO login attaches to an existing account whose
username matches the mapped localpart. Only enable this if your IdP usernames are
unique and never reused, as it allows an IdP identity to claim a matching local
account.
</Callout>

### Voice / video calls (TURN)

Calls behind NAT need a TURN server, which Synapse cannot provide on its own. Point
`TURN_URI` and `TURN_SHARED_SECRET` at a [coturn](https://github.com/coturn/coturn)
instance (run separately) to enable calling.

## Migrating an existing Matrix deployment

<Callout type="danger" title="Keep your storage names, or your server looks wiped">
All your data (rooms, messages, users) lives in the **database/volume**, not in
`homeserver.yaml`. When updating an already-deployed service, keep `POSTGRES_DB` and
the **volume names identical** to your current deployment. Changing them makes Synapse
start against a fresh, empty database. The old data is not deleted, just detached, but
your server appears empty. To gain new features, update the environment variables and
the entrypoint script only; never rename volumes or the database.
</Callout>

## Traefik: allow encoded characters in URLs

With the default Traefik 3 proxy, you can sign in and send DMs but **can't load media
or join public/private rooms**. Traefik 3 rejects URL-encoded characters like `%23`
(an encoded `#`) by default, which breaks Matrix endpoints that rely on them.

Fix it in Coolify's Traefik proxy configuration, under the `command:` key:

```yaml
# Allow Matrix's encoded `#` and `%` characters in URLs
- '--entrypoints.http.http.encodedcharacters.allowencodedhash=true'
- '--entrypoints.https.http.encodedcharacters.allowencodedhash=true'
- '--entrypoints.http.http.encodedcharacters.allowencodedpercent=true'
- '--entrypoints.https.http.encodedcharacters.allowencodedpercent=true'
```

## Links

- [Official website](https://matrix.org?utm_source=coolify.io)
- [Synapse documentation](https://element-hq.github.io/synapse/latest/welcome_and_overview.html?utm_source=coolify.io)
- [Synapse on GitHub](https://github.com/element-hq/synapse?utm_source=coolify.io)
- [Docker image](https://hub.docker.com/r/matrixdotorg/synapse?utm_source=coolify.io)
- [Matrix Federation Tester](https://federationtester.matrix.org?utm_source=coolify.io)
