---
title: "Terraria Server"
description: "Host your own Terraria game server on Coolify for multiplayer adventures, world creation, and customizable gameplay."
---

# Terraria Server

![Terraria Server](/docs/images/services/terraria.svg)

## What is Terraria?

Terraria is a 2D sandbox adventure game where you can dig, fight, explore, and build in a vast, procedurally generated world. Players can battle enemies, discover treasures, craft weapons and armor, and build structures in various biomes.

## Environment Variables

| Name       | Description                                                                                                                                                                                                         | Required | Default Value          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------- |
| AUTOCREATE | Creates a world if none is found in the path specified by -world. World size is specified by: 1(small), 2(medium), and 3(large).                                                                                    | yes      | 2                      |
| WORLDNAME  | Sets the name of the world when using -autocreate.                                                                                                                                                                  | yes      | world1                 |
| DIFFICULTY | Sets world difficulty when using autocreate. Options: 0(normal), 1(expert), 2(master), 3(journey)                                                                                                                   | yes      | 1                      |
| MAXPLAYERS | The maximum number of players allowed                                                                                                                                                                               | yes      | 8                      |
| PASSWORD   | Set a password for the server                                                                                                                                                                                       | yes      | mypassword             |
| MOTD       | Set the server motto of the day text.                                                                                                                                                                               | yes      | Welcome to the server! |
| LANGUAGE   | Sets the server language from its language code. Available codes: en/US = English de/DE = German it/IT = Italian fr/FR = French es/ES = Spanish ru/RU = Russian zh/Hans = Chinese pt/BR = Portuguese pl/PL = Polish | yes      | en/US                  |
| SECURE     | Option to prevent cheats. (1: no cheats or 0: cheats allowed)                                                                                                                                                       | yes      | 1                      |

## Links

- [Official Website](https://www.terraria.org/?utm_source=coolify.io)
- [GitHub](https://github.com/hexlo/terraria-server-docker?utm_source=coolify.io)
