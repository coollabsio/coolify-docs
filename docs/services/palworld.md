---
name: Palworld Server
icon: palworld.svg
description: A comprehensive Palworld dedicated server hosted with Coolify, providing full control over game settings, maintenance, and automation.
tags: ["game", "palworld", "server", "multiplayer", "dedicated"]
---

# Palworld Server

<ZoomableImage src="/docs/public/images/services/palworld.svg" alt="Palworld Server" />

## What is Palworld Server?

Palworld Server is a dedicated, self-hosted instance of the popular survival-crafting and monster-taming game, Palworld. Hosting your own server through Coolify gives you full control over all game settings (EXP rate, damage rates, capture difficulty, etc.) and allows for advanced maintenance features like scheduled backups and reboots.

### Environment variables

Part of this information is from the palworld-server-docker docs at: https://github.com/thijsvanloef/palworld-server-docker

You can use the following values to change the settings of the server on boot.
## 🎮 Palworld Server Environment Variables

| Variable | Description | Coolify Default Value | Section |
| :--- | :--- | :--- | :--- |
| **`TZ`** | Timezone for the container. | `UTC` | System |
| **`PUID`** | User ID running server processes. | `1000` | System |
| **`PGID`** | Group ID running server processes. | `1000` | System |
| **`MULTITHREADING`** | Enables multi-core usage for the server. | `false` | System |
| **`MAX_PLAYERS`** (`PLAYERS`) | Maximum number of players allowed on the server. | `16` | Server |
| **`SERVER_NAME`** | The name displayed for the Palworld server in the in-game list. | *(Long)* | Server |
| **`SERVER_DESCRIPTION`** | The description displayed for the server. | *(Long)* | Server |
| **`SERVER_PASSWORD`** | Password required for players to join. | `worldofpals` | Server |
| **`ADMIN_PASSWORD`** | Password for RCON/Admin functions. | `adminPassword` | Server |
| **`COMMUNITY`** | Sets the server as a "Community Server" (public). | `false` | Server |
| **`PUBLIC_IP`** | Forces a specific public IP/domain (optional). | `-` (Empty) | Server |
| **`PUBLIC_PORT`** | The public port for server traffic. | `8211` | Network |
| **`PORT`** | Internal Palworld game port (must be 8211). | `8211` | Network |
| **`QUERY_PORT`** | Internal Steam Query Port (must be 27015). | `27015` | Network |
| **`RCON_ENABLED`** | Enables Remote Console (RCON). | `true` | RCON |
| **`RCON_PORT`** | The port for RCON connections. | `25575` | RCON |
| **`UPDATE_ON_BOOT`** | Checks and installs updates on container startup. | `true` | Update |
| **`BACKUP_ENABLED`** | Enables the automatic backup function. | `true` | Backup |
| **`DELETE_OLD_BACKUPS`** | Automatically deletes old backups. | `false` | Backup |
| **`OLD_BACKUP_DAYS`** | Number of days after which old backups are deleted. | `30` | Backup |
| **`BACKUP_CRON_EXPRESSION`** | Cron expression for backup frequency. | `0 0 * * *` | Backup |
| **`AUTO_UPDATE_ENABLED`** | Enables automatic updates via cron. | `false` | Automation |
| **`AUTO_UPDATE_CRON_EXPRESSION`** | Cron expression for update frequency. | `0 * * * *` | Automation |
| **`AUTO_UPDATE_WARN_MINUTES`** | Minutes before an update to send an RCON warning. | `30` | Automation |
| **`AUTO_REBOOT_ENABLED`** | Enables automatic reboots via cron. | `false` | Automation |
| **`AUTO_REBOOT_EVEN_IF_PLAYERS_ONLINE`**| Forces reboot even if players are online. | `false` | Automation |
| **`AUTO_REBOOT_WARN_MINUTES`** | Minutes before a reboot to send an RCON warning. | `5` | Automation |
| **`AUTO_REBOOT_CRON_EXPRESSION`** | Cron expression for reboot frequency. | `0 0 * * *` | Automation |
| **`AUTO_PAUSE_ENABLED`** | Pauses the server when no players are online. | `false` | Automation |
| **`AUTO_PAUSE_TIMEOUT_EST`** | Time in seconds before the server pauses. | `180` | Automation |
| **`AUTO_PAUSE_LOG`** | Enables logging for the auto-pause function. | `true` | Automation |
| **`AUTO_PAUSE_DEBUG`** | Enables debug mode for auto-pause. | `false` | Automation |
| **`ENABLE_PLAYER_LOGGING`** | Enables logging of player actions. | `true` | Automation |
| **`PLAYER_LOGGING_POLL_PERIOD`** | Interval in seconds for fetching player logs. | `5` | Automation |
| **`DIFFICULTY`** | Difficulty level of the world. | `None` | Game Config |
| **`RANDOMIZER_TYPE`** | Type of randomizer (if used). | `-` (Empty) | Game Config |
| **`RANDOMIZER_SEED`** | Seed value for the randomizer. | `none` | Game Config |
| **`DAYTIME_SPEEDRATE`** | Speed rate for the day cycle. | `1.000000` | Game Config |
| **`NIGHTTIME_SPEEDRATE`** | Speed rate for the night cycle. | `1.000000` | Game Config |
| **`EXP_RATE`** | Multiplier for experience points gained. | `1.000000` | Game Config |
| **`PAL_CAPTURE_RATE`** | Multiplier for Pal capture rate. | `1.000000` | Game Config |
| **`PAL_SPAWN_NUM_RATE`** | Multiplier for the number of Pals spawned. | `1.000000` | Game Config |
| **`PAL_DAMAGE_RATE_ATTACK`** | Multiplier for damage dealt by Pals. | `1.000000` | Game Config |
| **`PAL_DAMAGE_RATE_DEFENSE`** | Multiplier for damage taken by Pals. | `1.000000` | Game Config |
| **`PLAYER_DAMAGE_RATE_ATTACK`** | Multiplier for damage dealt by players. | `1.000000` | Game Config |
| **`PLAYER_DAMAGE_RATE_DEFENSE`** | Multiplier for damage taken by players. | `1.000000` | Game Config |
| **`PLAYER_STOMACH_DECREASE_RATE`** | Speed at which the player's hunger decreases. | `1.000000` | Game Config |
| **`PLAYER_STAMINA_DECREASE_RATE`** | Speed at which the player's stamina decreases. | `1.000000` | Game Config |
| **`PLAYER_AUTO_HP_REGEN_RATE`** | Rate of player's automatic HP regeneration. | `1.000000` | Game Config |
| **`PLAYER_AUTO_HP_REGEN_RATE_IN_SLEEP`**| Rate of player's automatic HP regeneration while sleeping. | `1.000000` | Game Config |
| **`PAL_STOMACH_DECREASE_RATE`** | Speed at which the Pal's hunger decreases. | `1.000000` | Game Config |
| **`PAL_STAMINA_DECREASE_RATE`** | Speed at which the Pal's stamina decreases. | `1.000000` | Game Config |
| **`PAL_AUTO_HP_REGEN_RATE`** | Rate of Pal's automatic HP regeneration. | `1.000000` | Game Config |
| **`PAL_AUTO_HP_REGEN_RATE_IN_SLEEP`**| Rate of Pal's automatic HP regeneration while sleeping. | `1.000000` | Game Config |
| **`BUILD_OBJECT_HP_RATE`** | Multiplier for HP of built objects. | `1.000000` | Game Config |
| **`BUILD_OBJECT_DAMAGE_RATE`** | Multiplier for damage dealt to built objects. | `1.000000` | Game Config |
| **`BUILD_OBJECT_DETERIORATION_DAMAGE_RATE`**| Multiplier for deterioration damage to buildings. | `1.000000` | Game Config |
| **`COLLECTION_DROP_RATE`** | Multiplier for drop rate of collected items. | `1.000000` | Game Config |
| **`COLLECTION_OBJECT_HP_RATE`** | Multiplier for HP of collectible objects. | `1.000000` | Game Config |
| **`COLLECTION_OBJECT_RESPAWN_SPEED_RATE`**| Respawn speed for collectible objects. | `1.000000` | Game Config |
| **`ENEMY_DROP_ITEM_RATE`** | Drop rate of items from defeated enemies. | `1.000000` | Game Config |
| **`DEATH_PENALTY`** | Loss upon death (`All`, `AllExceptEquip`, `None`). | `All` | Game Config |
| **`ENABLE_PLAYER_TO_PLAYER_DAMAGE`** | Enables damage between players. | `False` | Game Config |
| **`ENABLE_FRIENDLY_FIRE`** | Enables friendly fire. | `False` | Game Config |
| **`ENABLE_INVADER_ENEMY`** | Enables enemy invasions of the base. | `True` | Game Config |
| **`ACTIVE_UNKO`** | Enables the "Unko" (poop/pile) mechanic. | `False` | Game Config |
| **`ENABLE_AIM_ASSIST_PAD`** | Enables aim assist for gamepads. | `True` | Game Config |
| **`ENABLE_AIM_ASSIST_KEYBOARD`** | Enables aim assist for mouse/keyboard. | `False` | Game Config |
| **`DROP_ITEM_MAX_NUM`** | Max number of dropped items (normal). | `3000` | Game Config |
| **`DROP_ITEM_MAX_NUM_UNKO`** | Max number of dropped items (Unko). | `100` | Game Config |
| **`BASE_CAMP_MAX_NUM`** | Max number of bases per world. | `128` | Game Config |
| **`BASE_CAMP_WORKER_MAX_NUM`** | Max number of Pals working in the base. | `15` | Game Config |
| **`DROP_ITEM_ALIVE_MAX_HOURS`** | Max hours dropped items remain in the world. | `1.000000` | Game Config |
| **`AUTO_RESET_GUILD_NO_ONLINE_PLAYERS`**| Automatically reset guilds if no players are online. | `False` | Game Config |
| **`AUTO_RESET_GUILD_TIME_NO_ONLINE_PLAYERS`**| Time in hours before a guild is reset. | `72.000000` | Game Config |
| **`GUILD_PLAYER_MAX_NUM`** | Max number of players per guild. | `20` | Game Config |
| **`BASE_CAMP_MAX_NUM_IN_GUILD`**| Max number of bases per guild. | `4` | Game Config |
| **`PAL_EGG_DEFAULT_HATCHING_TIME`**| Default hatching time for Pal eggs in hours. | `72.000000` | Game Config |
| **`WORK_SPEED_RATE`** | Multiplier for Pal work speed. | `1.000000` | Game Config |
| **`AUTO_SAVE_SPAN`** | Auto-save interval in seconds. | `30.000000` | Game Config |
| **`IS_MULTIPLAY`** | Enables multiplayer. | `False` | Game Config |
| **`IS_PVP`** | Enables Player vs Player (PvP). | `False` | Game Config |
| **`HARDCORE`** | Enables Hardcore mode. | `False` | Game Config |
| **`PAL_LOST`** | Pals are lost upon player death. | `False` | Game Config |
| **`CAN_PICKUP_OTHER_GUILD_DEATH_PENALTY_DROP`**| Can pick up dropped items from other guild members' deaths. | `False` | Game Config |
| **`ENABLE_NON_LOGIN_PENALTY`** | Enables penalties for non-logging players. | `True` | Game Config |
| **`ENABLE_FAST_TRAVEL`** | Enables Fast Travel. | `True` | Game Config |
| **`IS_START_LOCATION_SELECT_BY_MAP`**| Starting location can be selected via map. | `True` | Game Config |
| **`EXIST_PLAYER_AFTER_LOGOUT`** | Player character remains in the world after logout. | `False` | Game Config |
| **`ENABLE_DEFENSE_OTHER_GUILD_PLAYER`**| Enables defense against other guild players. | `False` | Game Config |
| **`INVISIBLE_OTHER_GUILD_BASE_CAMP_AREA_FX`**| Makes other guild base area effects invisible. | `False` | Game Config |
| **`BUILD_AREA_LIMIT`** | Limits the building area. | `False` | Game Config |
| **`ITEM_WEIGHT_RATE`** | Multiplier for item weight. | `1.000000` | Game Config |
| **`COOP_PLAYER_MAX_NUM`** | Max player count in Co-op (non-dedicated). | `4` | Game Config |
| **`REGION`** | Server region. | `-` (Empty) | Game Config |
| **`USEAUTH`** | Enables internal authentication. | `True` | Game Config |
| **`BAN_LIST_URL`** | URL for the global ban list. | *(URL)* | Game Config |
| **`REST_API_ENABLED`** | Enables the optional REST API. | `False` | REST API |
| **`REST_API_PORT`** | Port for the optional REST API. | `8212` | REST API |
| **`SHOW_PLAYER_LIST`** | Shows the player list in-game. | `True` | Game Config |
| **`ENABLE_PREDATOR_BOSS_PAL`** | Enables Boss Pals as predators. | `True` | Game Config |
| **`MAX_BUILDING_LIMIT_NUM`** | Max number of buildings (0 for unlimited). | `0` | Game Config |
| **`SERVER_REPLICATE_PAWN_CULL_DISTANCE`**| Cull distance for Pawns (rendering distance). | `15000.000000` | Game Config |
| **`SERVER_REPLICATE_PAWN_CULL_DISTANCE_IN_BASE_CAMP`**| Cull distance for Pawns inside the base camp. | `5000.000000` | Game Config |
| **`CROSSPLAY_PLATFORMS`** | Allowed crossplay platforms. | `(Steam,Xbox,PS5,Mac)` | Game Config |
| **`USE_BACKUP_SAVE_DATA`** | Uses backup save data. | `True` | Game Config |
| **`USE_DEPOT_DOWNLOADER`** | Uses depot downloader (internal). | `False` | Update |
| **`INSTALL_BETA_INSIDER`** | Installs beta/insider version (internal). | `False` | Update |
| **`ALLOW_GLOBAL_PALBOX_EXPORT`** | Allows global Palbox export. | `True` | Game Config |
| **`ALLOW_GLOBAL_PALBOX_IMPORT`** | Allows global Palbox import. | `False` | Game Config |
| **`EQUIPMENT_DURABILITY_DAMAGE_RATE`**| Multiplier for equipment durability damage. | `1.000000` | Game Config |
| **`ITEM_CONTAINER_FORCE_MARK_DIRTY_INTERVAL`**| Interval to force item container update. | `1.000000` | Game Config |
| **`BOX64_DYNAREC_STRONGMEM`** | Box64 Dynamic Recompiler Memory (ARM64). | `-` (Empty) | Box64 |
| **`BOX64_DYNAREC_BIGBLOCK`** | Box64 Big Block Optimization (ARM64). | `-` (Empty) | Box64 |
| **`BOX64_DYNAREC_SAFEFLAGS`** | Box64 Safe Flags (ARM64). | `-` (Empty) | Box64 |
| **`BOX64_DYNAREC_FASTROUND`** | Box64 Fast Rounding (ARM64). | `-` (Empty) | Box64 |
| **`BOX64_DYNAREC_FASTNAN`** | Box64 Fast NaN (ARM64). | `-` (Empty) | Box64 |
| **`BOX64_DYNAREC_X87DOUBLE`** | Box64 x87 Double Precision (ARM64). | `-` (Empty) | Box64 |
### Game Ports

| Port  | Info                |
|-------|---------------------|
| 8211  | Game Port (UDP)     |
| 8212  | REST API Port (TCP) |
| 27015 | Query Port (UDP)    |
| 25575 | RCON Port (TCP)     |

## Using RCON

RCON is enabled by default for the palworld-server-docker image.
Opening the RCON CLI is quite easy:

```bash
docker exec -it palworld-server rcon-cli "<command> <value>"
```

For example, you can broadcast a message to everyone in the server with the following command:

```bash
docker exec -it palworld-server rcon-cli "Broadcast Hello everyone"
```

This will open a CLI that uses RCON to write commands to the Palworld Server.

### List of server commands

| Command                          | Info                                                |
|----------------------------------|-----------------------------------------------------|
| Shutdown {Seconds} {MessageText} | The server is shut down after the number of Seconds |
| DoExit                           | Force stop the server.                              |
| Broadcast                        | Send message to all player in the server            |
| KickPlayer {SteamID}             | Kick player from the server..                       |
| BanPlayer {SteamID}              | BAN player from the server.                         |
| TeleportToPlayer {SteamID}       | Teleport to current location of target player.      |
| TeleportToMe {SteamID}           | Target player teleport to your current location     |
| ShowPlayers                      | Show information on all connected players.          |
| Info                             | Show server information.                            |
| Save                             | Save the world data.                                |
| UnBanPlayer {SteamID}            | Unban player {SteamID} from the server.             |

For a full list of commands go to: [https://tech.palworldgame.com/settings-and-operation/commands](https://tech.palworldgame.com/settings-and-operation/commands)

## Links

- [Official Palworld Website](https://www.palworldgame.com/?utm_source=coolify.io)
- [Official Steam Page](https://store.steampowered.com/app/1623730/Palworld/?utm_source=coolify.io)
- [Docker Image GitHub (thijsvanloef/palworld-server-docker)](https://github.com/thijsvanloef/palworld-server-docker?utm_source=coolify.io)