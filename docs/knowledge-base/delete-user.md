---
title: Delete User
description: "Safely delete users from Coolify with automatic team ownership transfer, resource cleanup, and team member reassignment procedures."
---

# Delete User
This guide will show you how to delete a user from the self-hosted Coolify instance.

::: warning Caution
  If you delete a user, and Coolify still has connection to the servers, it will
  delete all the resources on the servers as well, not just from Coolify's
  database.
:::

Only users who are in the `root` team can delete users from the UI.

- Go to the `Team` page.
- Switch to `Admin View` tab.

Here you can see all the users registered in Coolify. Click on the `Delete` button next to the user you want to delete.

## Deletion process

::: info Tip
The root team or root user cannot be deleted.
:::

Coolify iterate over all the teams of a user and decide of the followings:

### The user is alone in the team

The team and all resources from the server and from Coolify's database are deleted.

### The user is not alone in the team

1. The user is the owner/admin of the team and no other owners/admins found, but the team **has members**:
   - The ownership is transferred to the first user in the team who is not the owner/admin.
   - The user is removed from the team. No resources are deleted.

2. The user is the owner/admin of the team and no other owners/admins found, but the team has **no members**:
   - The team and all resources from the server and from Coolify's database are deleted.

3. The user is not the owner/admin of the team:
   - The user is removed from the team. No resources are deleted.
