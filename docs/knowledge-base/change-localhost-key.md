---
title: "Change Localhost Key"
description: "Replace and regenerate Coolify's localhost SSH private key with safe database backup procedures and Docker container key installation."
---

# Change Localhost Key
This guide will show you how to replace the stored localhost private key for Coolify.

::: warning Caution
  Take a backup of the stored private key in the database before starting this operation.
:::

## Key deletion from database
In the Postgres database in which the data for Coolify is stored, there is a private_keys table.
This table contains the private keys for all servers connected to the Coolify instance.
Be careful to not accidentally delete the wrong keys, as there usually is no way to undo.


1. Navigate to the private_keys table in the Postgres database for Coolify
   - Said table is located under the public schema in the database.

2. Select the row that is marked with:
   - Row index and ID of 0, as well as the name of "localhost's key"

3. Delete the selected row from the database
   - If completed successfully, proceed to the next section.


::: success Tip
  It helps to do this with a graphical interface for managing the database.
:::

## Installing new keys in the host machine

After the key has been deleted from the database, you need to add the new keys into the correct place in the Coolify data folders.

1. Stop your Coolify instance completely.

2. Find the /ssh/keys directory for your Coolify installation.
   - Usually located in /data/ssh/keys if you followed the quick install.

3. Write the public and private keys to the correct files
   - Your ED25519 public key shall be stored in id.root@host.docker.internal.pub
   - Your ED25519 private key shall be stored in id.root@host.docker.internal

4. Start your Coolify instance
   - Coolify will now proceed to seed your keys to the Postgres database.
   - Make sure the Database\Seeders\PopulateSshKeysDirectorySeeder does not error.

::: info Note
  If you receive an output of "SSH key found for the Coolify host machine (localhost)", the operation completed successfully and unless you get any other output, your new key shall now be working.
:::
