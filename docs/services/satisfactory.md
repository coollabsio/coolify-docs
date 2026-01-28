---
title: "Satisfactory"
description: "Run Satisfactory server on Coolify for multiplayer gaming."
---

# What is Satisctory?

Satisfactory
is a first-person, open-world factory simulation game focused on building, automation, and exploration on an alien planet. Players, as "Capital Pioneers" for FICSIT Inc., explore, gather resources, and build massive, multi-story factories interconnected by conveyor belts to automate production.

## Info

The server may run on less than 8GB of RAM, though 8GB - 16GB is still recommended per the the [official wiki](https://satisfactory.wiki.gg/wiki/Dedicated_servers#Requirements). You may need to increase the container's defined --memory restriction as you approach the late game (or if you're playing with many 4+ players)

### Updating

The game automatically updates when the container is started or restarted (unless you set `SKIPUPDATE=true`).

### Environment Variables

| Parameter               |  Default  | Function                                                  |
|-------------------------|:---------:|-----------------------------------------------------------|
| `AUTOSAVENUM`           |    `5`    | number of rotating autosave files                         |
| `DEBUG`                 |  `false`  | for debugging the server                                  |
| `DISABLESEASONALEVENTS` |  `false`  | disable the FICSMAS event (you miserable bastard)         |
| `LOG`                   |  `false`  | disable Satisfactory log pruning                          |
| `MAXOBJECTS`            | `2162688` | set the object limit for your server                      |
| `MAXPLAYERS`            |    `4`    | set the player limit for your server                      |
| `MAXTICKRATE`           |   `30`    | set the maximum sim tick rate for your server             |
| `MULTIHOME`             |   `::`    | set the server's listening interface (usually not needed) |
| `PGID`                  |  `1000`   | set the group ID of the user the server will run as       |
| `PUID`                  |  `1000`   | set the user ID of the user the server will run as        |
| `SERVERGAMEPORT`        |  `7777`   | set the game's server port                                |
| `SERVERMESSAGINGPORT`   |  `8888`   | set the game's messaging port (internally and externally) |
| `SERVERSTREAMING`       |  `true`   | toggle whether the game utilizes asset streaming          |
| `SKIPUPDATE`            |  `false`  | avoid updating the game on container start/restart        |
| `STEAMBETA`             |  `false`  | set experimental game version                             |
| `STEAMBETAID`           |           | set a custom beta game version (for testing)              |
| `STEAMBETAKEY`          |           | set password for the beta game version (for testing)      |
| `TIMEOUT`               |   `30`    | set client timeout (in seconds)                           |
| `VMOVERRIDE`            |  `false`  | skips the CPU model check (should not ordinarily be used) |

## Modding

This game server allows modding
> Please refer to the github link below to know more about modding

## Links

- [GitHub](https://github.com/wolveix/satisfactory-server)