---
title: "Notifications"
description: "Configure multi-channel notifications in Coolify with Email, Telegram, Discord, Slack, and Pushover for deployments, backups, and server monitoring alerts."
---

# Notifications

Coolify provides a robust notification system that supports multiple channels. You can configure notifications in the **Notifications** tab of your Coolify dashboard.

## Notification Providers

Below are guides for setting up supported notification providers in Coolify.

### Email

::: info
Email notifications can be configured using either SMTP or Resend.
:::


1. Navigate to **Notifications** → **Email**

2. Choose your email provider:
   - Use system wide (transactional) email settings (if you self-host Coolify, you can set this up in the Instance Settings - If you use Coolify Cloud, this is set up for you).
   - SMTP Server
   - Resend

3. Configure your chosen provider:

#### System-Wide Email Settings
   - Enable the `Use system wide (transactional) email settings` checkbox
   - If you're setting this up yourself, please refer to the [SMTP Server Configuration](#smtp-server-configuration) section below for detailed settings.

#### SMTP Server Configuration
- Fill in the following fields:
  - `From Name` - Display name for the sender
  - `From Address` - Email address notifications will come from
  - `Host` - SMTP server hostname (e.g., smtp.mail.com)
  - `Port` - SMTP port:
    - Port 587 - StartTLS port (most widely supported)
    - Port 465 - TLS/SSL port (recommended for highest security)
  - `Username` - SMTP authentication username
  - `Password` - SMTP authentication password
  - `Encryption` - Choose your encryption method:
    - StartTLS - Starts unencrypted then upgrades to TLS via StartTLS (typically used with port 587)
    - TLS/SSL - Uses TLS encryption from the start (typically used with port 465 - automatically puts `ssl://` in front of the host)
    - None - No encryption (NOT recommended as it is highly insecure)
  - `Timeout` - Connection timeout in seconds
- Enable the SMTP Server via the `Enabled` checkbox

::: success Tip
   We recommend using TLS/SSL encryption with port 465 for the most secure connection. This provides encryption from the start of the connection.
:::

::: info
   Some hosting providers have specific port restrictions. For example, Hetzner blocks port 465 by default. Check with your hosting provider about port availability and any required configuration changes.
::: 

#### Resend Configuration
   - Enter your `Resend API Key`
   - Enable the `Resend` checkbox

4. Click `Send Test Email` to verify your setup


### Telegram


1. Initial Setup (Setup only possible on phone)
   - Create a Telegram account using your phone number
   - Open the Telegram app on your phone
   - Go to **Settings** → **Profile**
   - Set up a username (recommended)

2. Create Your Bot
   - Message [@BotFather](https://t.me/botfather)
   - Send the `/newbot` command
   - Follow BotFather's instructions to create your bot
   - Copy the `Bot Token` when displayed

::: info
  After copying your bot token, delete the message containing it from Telegram. Store the token securely as anyone with access to it can control your bot.
:::

3. Create and add your bot to a group
   - Create a new group in Telegram
   - Add your bot to the group (you can add it by using the bot name chosen while creating the bot)

4. Make the bot an admin of the group
   - Click on the group name
   - Locate the members list
   - Click on the bot name
   - Click on **Add to group or channel**
   - Choose the group
   - Enable the `admin` toggle
   - Click on **Add bot as admin**

5. Enable Topics (Optional, Setup only possible on phone)
   - Open the group on your phone
   - Tap the group name
   - Tap the pencil icon (edit)
   - Find and enable **Topics** (this enables threads for the group)
   - You can now create topics using the 3-dot menu in the group (also works on desktop)

6. Get Required IDs
   - Visit: `https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates` (Replace `{YOUR_BOT_TOKEN}` with your actual bot token)
   - Send a test message in your group or thread/topic
   - Find these values in the response:
     - `Chat ID`: Look for `"chat": {"id": -100XXXXXXXXX,` (for groups/channels, the chat ID usually starts with `-100`)
     - `Thread/Topic ID` (if using threads): Look for `"message_thread_id":XXXXX,`

7. Configure Coolify
   - Go to **Notifications** → **Telegram**
   - Enter your `bot token` (from step 2)
   - Enter the `chat ID` (include the `-` minus sign if present)
   - Enter the `thread/topic ID` (only if you are using threads)
   - Save settings
   - Enable the Telegram channel
   - Send a `Test notification`


::: info
  Common issues:
  - Make sure the bot is an admin in the group/channel
  - Include the minus sign (-) in the chat ID if present
  - If `getUpdates` returns an empty response, send another message and try again
  - if you can not acces `getUpdates` make sure you have the correct bot token and you have replace the `{YOUR_BOT_TOKEN}` with your actual bot token (replace everything including the quotes)
:::

### Discord


1. Create a Discord Server and Channel
   - Create a new server or use an existing one
   - Create a new text channel for Coolify notifications

2. Create a webhook
   - Open Discord server settings
   - Go to **Integrations** → **Webhooks**
   - Click **New Webhook**
   - Choose the channel you created for Coolify notifications
   - Copy the `webhook URL`

3. Configure in Coolify:
   - Go to **Notifications** → **Discord**
   - Paste the `webhook URL` in the Webhook URL field
   - Save the settings
   - Enable the Discord channel
   - Send a `Test notification`


::: info
  See [Discord's Webhook Guide](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) for more detailed setup instructions.
:::

### Slack


1. Create a Slack App
   - Visit [Slack API](https://api.slack.com/apps)
   - Click **Create New App** → **From scratch**
   - Choose your workspace

2. Enable webhooks:
   - Go to **Incoming Webhooks**
   - Toggle **Activate Incoming Webhooks**
   - Click **Add New Webhook to Workspace**
   - Choose a channel for Coolify notifications
   - Copy the `webhook URL`

3. Configure in Coolify:
   - Go to **Notifications** → **Slack**
   - Paste the `webhook URL` in the Webhook URL field
   - Save the settings
   - Enable the Slack channel
   - Send a `Test notification`


### Pushover (Push Notifications)


1. Get User Key
   - Log in or sign up at [Pushover](https://pushover.net)
   - Copy your `User Key` from the top right of the page

2. Create an Application
   - Visit [Create Application](https://pushover.net/apps/build)
   - Fill in application details
   - Create the application
   - Copy the `API Token/Key` from the top left of the page

3. Configure in Coolify:
   - Go to **Notifications** → **Pushover**
   - Enter your `User Key` (from step 1)
   - Enter the `API Key` from your created application (from step 2)
   - Save the settings
   - Enable the Pushover channel
   - Send a `Test notification`


::: info
  Pushover allows you to receive notifications on multiple devices including iOS, Android, and desktop.
:::

## Notification Events

You can configure which events trigger notifications in your notification settings:

### Deployments
  - Deployment Success
  - Deployment Failure
  - Container Status changes

### Backups
  - Backup Success
  - Backup Failure

### Scheduled Tasks
  - Task Success
  - Task Failure

### Server Events
  - Docker Cleanup Success
  - Docker Cleanup Failure
  - High Disk Usage Alerts
  - Server Status Updates

::: success Multiple Channels
  You can configure different events for each notification channel. For example, you can send deployment failure notifications to Email and successes to Slack.
:::