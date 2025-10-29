---
title: "Custom Commands"
description: "Add custom Docker run options to Coolify deployments including GPU support, security options, system controls, devices, and resource limits."
---

# Custom Commands
For deploying your resources, you can add custom options to the final docker command, which is used to run your container.

::: warning Caution
  Some of the docker native options are not supported, because it could break the Coolify's functionality. If you need any of the unsupported options, please [contact us](/get-started/support)
:::

## Supported Options

- `--ip`
- `--ip6`
- `--shm-size`
- `--cap-add`
- `--cap-drop`
- `--security-opt`
- `--sysctl`
- `--device`
- `--ulimit`
- `--init`
- `--ulimit`
- `--privileged`
- `--gpus`

## Usage

You can simply add the options to the `Custom Docker Options` field on the `General` tab of your resource.

Example: `--cap-add SYS_ADMIN --privileged`