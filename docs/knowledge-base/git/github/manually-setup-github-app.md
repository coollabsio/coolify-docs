---
title: "Manually Setup GitHub App"
---

# Manually Setup GitHub App
This guide will show you how to manually setup an existing Github App or how to change a currently configured one.

Since `4.0.0-beta.399` you are able to change all the Github App details inside Coolify.


## On Github
1. Generate a Private Key on your Github App configuration page (if you already have one, ignore this).
2. Set the `Homepage URL` to `https://app.coolify.io`.
3. Set the `Setup URL` to the following: `https://app.coolify.io/webhooks/source/github/install?source=<source_uuid>` where `source_uuid` will be the newly created source in Coolify.
4. Activate `Webhook` and set the `Webhook URL` to `https://app.coolify.io/webhooks/source/github/events`
5. Set the `Webhook Secret`.
6. In the `Install App` section, Install the app to the organization you want to use.
7. Copy the `Installation ID` from the URL of the page after you installed the Github App.
8. In the `Permissions` section, set the following permissions:
   Repository permissions:
    - Contents: read
    - Metadata: read
    - Pull Request: read & write (optional, if you want to use the pull request feature)
   Account permissions:
    - Email addresses: read
9. In the `Subscribe to events` section, enable tho following events:
    - Push
    - Pull Request (optional, if you want to use the pull request feature)


## On Coolify
0. Add the `Private Key` generated in the previous step as a new `Private Key` in the `Keys & Tokens` section.
1. Go to the `Sources` page and click on the `+` button or edit the existing one.
2. Fill the name and the organization name (optional). Press `Continue`.
3. Click on the `Continue` button on the `Manual Installation` section.
4. Enter the `Github App Name`, `App ID`, `Installation ID`, `Client ID`, `Client Secret` , `Webhook Secret` from the GitHub App configuration page.
5. Select the `Private Key` you added in step 0 and `Save`.
6. If you filled everything correctly, click on the `Sync Name` button. If no errors, then you are done.
