---
title: "OAuth"
description: "Set up OAuth authentication with GitHub, GitLab, Google, Azure, or Bitbucket for secure single sign-on access to your Coolify instance."
---

# OAuth
You can login to coolify with email/password, or with OAuth.
Using OAuth, you can delegate authorization to get a user's email address to an external IDP provider. This lets coolify know that the user owns a specific email address associated with an existing coolify user. This is an alternative to forcing the user to provide a password to coolify to prove they own that same email address. Authorization servers supported by coolify include Azure, BitBucket, Github, Gitlab, and Google.

## Setup OAuth

To setup OAuth for a given IDP, you need to get a client id and a client secret from the authorization server to put into **YOUR_COOLIFY_DASHBOARD**/settings/oauth.
You'll also need to set a Redirect URI for the authorization server to send the user's data back to once they have authorized coolify to access their email address.
The Redirect URI to provide to the IDP should be in the format of **YOUR_COOLIFY_DASHBOARD**/auth/*PROVIDER*/callback for example.com : https://coolify.example.com/auth/google/callback

- [Google OAuth](https://support.google.com/cloud/answer/6158849?hl=en)
  - Authorized JavaScript origins should be **YOUR_COOLIFY_DASHBOARD**
  - Authorized redirect URIs should be the redirect uri you set in **YOUR_COOLIFY_DASHBOARD**/settings/oauth for google. for example.com :   https://coolify.example.com/auth/google/callback
- [Github OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
  - Homepage URL should be **YOUR_COOLIFY_DASHBOARD**
  - Authorization callback URL should be the redirect uri you set in **YOUR_COOLIFY_DASHBOARD**/settings/oauth for github. for example.com : https://coolify.example.com/auth/github/callback