---
title: Migrate Applications
description: Step-by-step guide to migrate applications, databases, and Docker volumes from one Coolify server to another with backup and restore scripts
---

# Migrate Applications to Another Coolify Host

Coolify does not have a built-in option to migrate applications from one server to another. 

You have to manually deploy your app on the new server and copy over your databases and volumes. This guide walks you through that process step by step.

::: info Note
  We assume you already have Coolify installed on your destination server and are ready to migrate your app.
::: 


## 1. Understand Data Persistence
When using Coolify, application data lives in one of two places:

<ZoomableImage src="/docs/images/knowledge-base/how-tos/migrate-apps-different-host/1.webp" alt="Screenshot of Migrate Apps Different Host" />

### Bind mounts
  - When using bind mounts, a host directory or file is mapped into the container. 
  - Any changes made to the directory or file on the host will immediately reflect inside the container.
  - To back up data, simply copy the host directory or file to the new server and update the bind-mount path in your application’s configuration.

### Volume mounts
  - With volume mounts, a Docker volume is created (Coolify usually creates the volume, but you can also set it up yourself.) and used to store application data. 
  - The volume is stored in Docker’s volume directory, typically under `/var/lib/docker/volumes/<VOLUME_NAME>`
  - You can’t just copy that directory directly, instead Docker provides a safe backup-and-restore method using a temporary container. 

::: info Note
  Since bind mounts are simple to migrate by copying files directly, this guide will focus primarily on volume backups.
:::


## 2. Backup and Restore Overview
The [Docker-recommended process](https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes) for volume migration looks like this:

<ZoomableImage src="/docs/images/knowledge-base/how-tos/migrate-apps-different-host/2.webp" alt="Screenshot of Migrate Apps Different Host" />

1. **Mount** your volume into a temporary container.
2. **Archive** the volume’s contents into a tarball.
3. **Copy** the tarball from the container to your host and then delete the temporary container.
4. **Transfer** the tarball to the new server.
5. **Create** a fresh volume on the destination.
6. **Mount** the transferred tarball into a temporary container.
7. **Extract** the archive into the new volume.

This series of steps ensures a consistent, safe backup and restore. Below, we’ll provide ready-to-use scripts and detailed instructions.

---

::: info Note
  The steps below include scripts to help you back up, transfer, and restore volumes easily and interactively. 
  
  They also include checks to ensure volumes and backups exist, to prevent mistakes like restoring to the wrong volume.
:::

## 3. Backup the Volume

1. **SSH into your server** where you have the Docker volume.
2. **Create a script** named `backup.sh`:
    ```sh
    touch backup.sh && chmod +x backup.sh
    ```
3. **Open** `backup.sh` in your editor and paste the following:

    ```sh title="backup.sh"
    #!/bin/bash
    
    # === INPUT PROMPTS ===
    # Prompt for the Docker volume name and set the variable
    read -p "[ Backup Agent ] [ INPUT ] Please enter the Docker volume name to back up: " VOLUME_NAME
    
    # Inform the user of the set volume name
    echo "[ Backup Agent ] [ INFO ] Backup Volume is set to $VOLUME_NAME"
    
    # Check if the entered volume exists
    if ! docker volume ls --quiet | grep -q "^$VOLUME_NAME$"; then
        echo "[ Backup Agent ] [ ERROR ] Volume '$VOLUME_NAME' doesn't exist, aborting backup."
        echo "[ Backup Agent ] [ ERROR ] Backup Failed!"
        exit 1  # Exit if volume doesn't exist
    else
        echo "[ Backup Agent ] [ INFO ] Volume '$VOLUME_NAME' exists, continuing backup..."
    fi
    
    # Prompt for the directory to save the backup
    read -p "[ Backup Agent ] [ INPUT ] Please enter the directory to save the backup (Optional: press enter to use ./volume-backup): " BACKUP_DIR
    # If no directory is entered, default to './volume-backup'
    BACKUP_DIR=${BACKUP_DIR:-./volume-backup}
    
    # Inform the user of the backup location
    echo "[ Backup Agent ] [ INFO ] Backup location is set to $BACKUP_DIR"
    
    # Set the backup file name based on the volume name
    BACKUP_FILE="${VOLUME_NAME}-backup.tar.gz"
    
    # Inform the user of the backup file name
    echo "[ Backup Agent ] [ INFO ] Backup file name is set to $BACKUP_FILE"
    
    # === SCRIPT START ===
    # Check if the backup directory exists
    if [ -d "$BACKUP_DIR" ]; then
        echo "[ Backup Agent ] [ INFO ] Directory '$BACKUP_DIR' already exists, skipping directory creation."
    else
        echo "[ Backup Agent ] [ INFO ] Directory '$BACKUP_DIR' does not exist, creating directory."
        # Create the backup directory, exit if creation fails
        mkdir -p "$BACKUP_DIR" || { 
            echo "[ Backup Agent ] [ ERROR ] Failed to create directory '$BACKUP_DIR', aborting backup."
            echo "[ Backup Agent ] [ ERROR ] Backup Failed!"
            exit 1
        }
    fi
    
    # Perform the backup operation
    echo "[ Backup Agent ] [ INFO ] Backing up volume: $VOLUME_NAME to $BACKUP_DIR/$BACKUP_FILE"
    
    # Run the Docker container to create the backup
    docker run --rm \
      -v "$VOLUME_NAME":/volume \
      -v "$(pwd)/$BACKUP_DIR":/backup \
      busybox \
      tar czf /backup/"$BACKUP_FILE" -C /volume . || { 
        # If the backup fails, print an error message and exit
        echo "[ Backup Agent ] [ ERROR ] Backup process failed, aborting."
        echo "[ Backup Agent ] [ ERROR ] Backup Failed!"
        exit 1
    }
    
    # If everything succeeds, notify the user
    echo "[ Backup Agent ] [ SUCCESS ] Backup completed!"
    ```

4. **Find the volume name** by running:

   ```sh
   docker volume ls
   ```

   Or from Coolify’s **Persistent Storage** page (see below).
   
   <ZoomableImage src="/docs/images/knowledge-base/how-tos/migrate-apps-different-host/3.webp" alt="Screenshot of Migrate Apps Different Host" />
5. **Stop your application** to perform a clean backup.
6. **Run** the script:

   ```sh
   ./backup.sh
   ```

   * When prompted, paste the volume name.
   * Press **Enter** to accept the default backup directory (`./volume-backup`), or type a custom path.
7. **Verify** that you now have a directory (e.g., `volume-backup`) containing `<VOLUME_NAME>-backup.tar.gz`.

---

## 4. Transfer the Backup to the New Server
::: success Tip
  If you already know how to manually transfer the backup file, feel free to move on to the next step.
:::

1. **Create** a second script named `transfer.sh`:
   ```sh
   touch transfer.sh && chmod +x transfer.sh
   ```
   
2. **Open** `transfer.sh` in your editor and paste the following:

    ```sh title="transfer.sh"
    #!/bin/bash
    
    # =============== CONFIG VARIABLES ===============
    SSH_PORT=22
    SSH_USER="root"
    SSH_IP="192.168.1.222"
    SSH_KEY="$HOME/.ssh/local-vm"
    SOURCE_PATH="./volume-backup"
    DESTINATION_PATH="/root/backups/volume-backup"
    MAX_RETRIES=3  # Max number of password attempts
    
    echo "[ Transfer Agent ] [ INFO ] Starting transfer..."
    echo "[ Transfer Agent ] [ INFO ] Trying SSH key: $SSH_KEY"
    echo "[ Transfer Agent ] [ INFO ] Transfer from: $SOURCE_PATH"
    echo "[ Transfer Agent ] [ INFO ] Transfer to: $SSH_USER@$SSH_IP:$DESTINATION_PATH"
    
    # If SSH key file doesn’t exist, fall back to password mode
    if [ ! -f "$SSH_KEY" ]; then
      echo "[ Transfer Agent ] [ WARN ] SSH key '$SSH_KEY' not found. Falling back to password authentication."
      SSH_KEY=""
    fi
    
    # If we need password-based auth, ensure Expect is installed
    if [ -z "$SSH_KEY" ] && ! command -v expect >/dev/null 2>&1; then
      echo "[ Transfer Agent ] [ ERROR ] The package expect is required for password authentication but not installed (Install it manually using sudo apt install expect and try again). Aborting."
      exit 1
    fi
    
    # ---------------------------------------------
    # Helper: test whether $1 (the password) is valid by doing “ssh … exit”
    # Returns 0 if OK, 1 if “Permission denied” (or any other failure)
    test_password_with_expect() {
      local PW="$1"
    
      expect -c "
        log_user 0
        set timeout 15
        spawn ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_IP exit
        expect {
          \"*?assword:\" {
            send -- \"$PW\r\"
            expect {
              \"Permission denied\" { exit 1 }
              eof { exit [lindex [wait] 3] }
            }
          }
          eof {
            exit [lindex [wait] 3]
          }
        }
      " >/dev/null 2>&1
    
      return $?
    }
    
    # Prompt up to $MAX_RETRIES times for a correct password
    get_password() {
      local retries=0
      while [ $retries -lt $MAX_RETRIES ]; do
        read -s -p "[ Transfer Agent ] [ INPUT ] Please enter the SSH password for $SSH_USER@$SSH_IP: " SSHPASS
        echo ""
        test_password_with_expect "$SSHPASS"
        if [ $? -eq 0 ]; then
          # Password is correct
          return 0
        else
          echo "[ Transfer Agent ] [ ERROR ] Invalid password. Please try again."
          retries=$((retries + 1))
        fi
      done
    
      echo "[ Transfer Agent ] [ ERROR ] Maximum retries reached. Aborting."
      exit 1
    }
    
    # ---------------------------------------------
    # STEP 0: Attempt SSH-key authentication (if a key is set)
    if [ -n "$SSH_KEY" ]; then
      # Use BatchMode to prevent falling back to password prompt
      ssh -i "$SSH_KEY" -o BatchMode=yes -o StrictHostKeyChecking=no -p "$SSH_PORT" \
        "$SSH_USER@$SSH_IP" exit >/dev/null 2>&1
      RC=$?
      if [ $RC -eq 0 ]; then
        echo "[ Transfer Agent ] [ INFO ] SSH key is valid!"
        USING_KEY=true
      else
        echo "[ Transfer Agent ] [ WARN ] SSH key authentication failed. Falling back to password authentication."
        SSH_KEY=""
        USING_KEY=false
      fi
    else
      USING_KEY=false
    fi
    
    # If key auth failed (or no key), prompt for password
    if [ "$USING_KEY" = false ]; then
      get_password
      echo "[ Transfer Agent ] [ INFO ] Password is valid!"
    fi
    
    # ---------------------------------------------
    # STEP 1: Ensure the full DESTINATION_PATH exists on the remote side.
    echo "[ Transfer Agent ] [ INFO ] Ensuring remote directory '$DESTINATION_PATH' exists..."
    if [ -n "$SSH_KEY" ]; then
      ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -p "$SSH_PORT" \
        "$SSH_USER@$SSH_IP" "mkdir -p $DESTINATION_PATH" >/dev/null 2>&1
      MKRC=$?
    else
      expect -c "
        log_user 0
        set timeout 5
        spawn ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_IP mkdir -p $DESTINATION_PATH
        expect {
          \"*?assword:\" {
            send -- \"$SSHPASS\r\"
            exp_continue
          }
          eof {
            exit [lindex [wait] 3]
          }
        }
      " >/dev/null 2>&1
      MKRC=$?
    fi
    
    if [ $MKRC -ne 0 ]; then
      echo "[ Transfer Agent ] [ ERROR ] Failed to create remote directory. Aborting."
      exit 1
    fi
    
    # ---------------------------------------------
    # STEP 2: Copy only the contents of local “volume-backup” into that folder.
    echo "[ Transfer Agent ] [ INFO ] Initiating file transfer..."
    
    # Capture any SCP stderr in a temp file so we can surface it if something goes wrong
    SCP_LOG="$(mktemp)"
    if [ -n "$SSH_KEY" ]; then
      # Suppress stdout, capture only stderr
      scp -i "$SSH_KEY" -o StrictHostKeyChecking=no -P "$SSH_PORT" -r \
          "$SOURCE_PATH"/. "$SSH_USER@$SSH_IP:$DESTINATION_PATH" > /dev/null 2> "$SCP_LOG"
      SCP_RC=$?
    else
      expect -c "
        log_user 0
        set timeout -1
        spawn scp -o StrictHostKeyChecking=no -P $SSH_PORT -r $SOURCE_PATH/. $SSH_USER@$SSH_IP:$DESTINATION_PATH
        expect {
          \"*?assword:\" {
            send -- \"$SSHPASS\r\"
            exp_continue
          }
          eof {
            exit [lindex [wait] 3]
          }
        }
      " 2> "$SCP_LOG"
      SCP_RC=$?
    fi
    
    if [ $SCP_RC -eq 0 ]; then
      echo "[ Transfer Agent ] [ SUCCESS ] Transfer completed."
      rm -f "$SCP_LOG"
      exit 0
    else
      echo "[ Transfer Agent ] [ ERROR ] Transfer failed."
      while IFS= read -r line; do
        echo "[ Transfer Agent ]    $line"
      done < "$SCP_LOG"
      rm -f "$SCP_LOG"
      exit 1
    fi
    ```
    
3. **Adjust** the variables at the top (`SSH_IP`, `SSH_USER`, `SSH_KEY`, `DESTINATION_PATH`) to match your new server.
4. **Run** the transfer:

   ```sh
   ./transfer.sh
   ```

   * If key-based authentication succeeds, the backup folder copies over via SCP.
   * Otherwise, you’ll be prompted for the SSH password.

---

## 5. Restore the Backup on the New Server

::: info Note
  In this example, we’ll use [Umami Analytics](https://umami.is/?utm_source=coolify.io) (PostgreSQL) to show how you restore a database-backed app. Adjust paths and volume names for your own database.
:::

1. **Deploy your application** on the new server with Coolify, then **stop it** so volumes will be created but won't be in use.
2. **SSH into** the new server and **create** a script called `restore.sh`:

   ```sh
   touch restore.sh && chmod +x restore.sh
   ```
3. **Paste** the following into `restore.sh`:
    ```sh title="restore.sh"
    #!/bin/bash
    
    # === VOLUME NAME INPUT ===
    # Prompt for the target Docker volume name to restore into
    read -p "[ Restore Agent ] [ INPUT ] Enter the target Docker volume name to restore into: " TARGET_VOLUME
    
    # === VOLUME CHECK ===
    # Check if the target volume exists
    if ! docker volume ls --quiet | grep -q "^$TARGET_VOLUME$"; then
      echo "[ Restore Agent ] [ ERROR ] Volume '$TARGET_VOLUME' doesn't exist."
    
      # Ask if the user wants to create the volume
      read -p "[ Restore Agent ] [ INPUT ] Do you want to create a new volume with the name '$TARGET_VOLUME'? (y/N): " create_volume
      if [[ "$create_volume" == "y" ]]; then
        echo "[ Restore Agent ] [ INFO ] Creating volume '$TARGET_VOLUME'..."
        docker volume create "$TARGET_VOLUME" || { 
          echo "[ Restore Agent ] [ ERROR ] Failed to create volume '$TARGET_VOLUME', aborting restore."
          echo "[ Restore Agent ] [ ERROR ] Restore Failed!"
          exit 1
        }
        echo "[ Restore Agent ] [ INFO ] Volume '$TARGET_VOLUME' created successfully."
      else
        echo "[ Restore Agent ] [ INFO ] Volume '$TARGET_VOLUME' doesn't exist and user opted not to create it. Aborting restore."
        echo "[ Restore Agent ] [ ERROR ] Restore Failed!"
        exit 1
      fi
    else
      echo "[ Restore Agent ] [ INFO ] Volume '$TARGET_VOLUME' exists, continuing..."
    fi
    
    # === BACKUP DIRECTORY INPUT ===
    # Prompt for the backup directory (default: ./volume-backup)
    read -p "[ Restore Agent ] [ INPUT ] Enter the backup directory (default: ./volume-backup): " BACKUP_DIR
    BACKUP_DIR=${BACKUP_DIR:-./volume-backup}
    
    # === BACKUP DIRECTORY CHECK ===
    # Check if the backup directory exists
    if [[ ! -d "$BACKUP_DIR" ]]; then
      echo "[ Restore Agent ] [ ERROR ] Backup directory not found: $BACKUP_DIR"
      echo "[ Restore Agent ] [ ERROR ] Restore Failed!"
      exit 1
    fi
    echo "[ Restore Agent ] [ INFO ] Backup directory '$BACKUP_DIR' found, continuing..."
    
    # === BACKUP FILE INPUT ===
    # Prompt for the backup file name
    read -p "[ Restore Agent ] [ INPUT ] Enter the backup file name (e.g., abc123_postgresql.tar.gz): " BACKUP_FILE
    
    # === BACKUP FILE CHECK ===
    # Check if the backup file exists
    if [[ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]]; then
      echo "[ Restore Agent ] [ ERROR ] Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
      echo "[ Restore Agent ] [ ERROR ] Restore Failed!"
      exit 1
    fi
    echo "[ Restore Agent ] [ INFO ] Backup file '$BACKUP_FILE' found, continuing..."
    
    # === SAFETY CONFIRMATION ===
    echo "[ Restore Agent ] [ INFO ] Make sure containers using '$TARGET_VOLUME' are stopped!"
    read -p "[ Restore Agent ] [ INPUT ] Proceed with restore? (y/N): " confirm
    if [[ "$confirm" != "y" ]]; then
      echo "[ Restore Agent ] [ ERROR ] Restore Failed: cancelled by user."
      exit 1
    fi
    
    # === RESTORE START ===
    # Inform the user that restore is starting
    echo "[ Restore Agent ] [ INFO ] Restoring $BACKUP_FILE into volume: $TARGET_VOLUME"
    
    # Run the Docker container to restore the backup
    docker run --rm \
      -v "$TARGET_VOLUME":/volume \
      -v "$(pwd)/$BACKUP_DIR":/backup \
      busybox \
      sh -c "cd /volume && tar xzf /backup/$BACKUP_FILE" || { 
        # If the restore process fails, print an error message and exit
        echo "[ Restore Agent ] [ ERROR ] Docker restore process failed, aborting."
        echo "[ Restore Agent ] [ ERROR ] Restore Failed!"
        exit 1
    }
    
    # If everything succeeds, notify the user
    echo "[ Restore Agent ] [ SUCCESS ] Restore completed!"
    ```

4. **Run** the script:

   ```sh
   ./restore.sh
   ```

   * Enter the **volume name** (from `docker volume ls` command or Coolify's Persistent Storage page).
   * Press **Enter** to accept `./volume-backup`, or type a custom backup path.
   * Enter the backup filename (e.g., `umami_postgresql-backup.tar.gz`).
   * Confirm you want to proceed by typing `y`.
   
---

## 6. Start Your Application
Once the restore finishes, go to Coolify’s dashboard and click **Deploy**. 

Your application should now use the migrated data. If it does not, or if logs show errors then repeat the restore step to ensure all files copied correctly.

::: warning Note
  If the database credentials (username, database name or password) are different on the new server, update them in Coolify’s dashboard to match those from the old server.
  
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/migrate-apps-different-host/4.webp" alt="Screenshot of Migrate Apps Different Host" />
:::
