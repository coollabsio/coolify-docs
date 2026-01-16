---
title: "Custom Commands"
description: "Add custom Docker run options to Coolify deployments including custom entrypoints, GPU support, security options, system controls, devices, and resource limits."
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
- `--entrypoint`

## Usage

You can simply add the options to the `Custom Docker Options` field on the `General` tab of your resource.

Example: `--cap-add SYS_ADMIN --privileged`

## Custom Entrypoint

The `--entrypoint` option allows you to override the default entrypoint of a Docker image without building a custom image.

### Syntax

Coolify supports three entrypoint syntax variations:

1. **Simple entrypoint**:
   ```bash
   --entrypoint /bin/sh
   ```

2. **Quoted command with arguments**:
   ```bash
   --entrypoint "sh -c 'npm start'"
   ```

3. **Assignment syntax**:
   ```bash
   --entrypoint=/usr/local/bin/custom-script
   ```

### Use Cases

#### Multiple Service Types from Single Image

Some Docker images, like ServerSideUp PHP, provide multiple entrypoints for different service types:
- Worker processes
- Queue schedulers
- Background jobs
- Web servers

Example for running a Laravel Horizon worker:
```bash
--entrypoint php --entrypoint artisan --entrypoint horizon
```

#### Custom Initialization Scripts

Override the default entrypoint to run custom initialization:
```bash
--entrypoint "/app/custom-init.sh"
```

### Usage in Coolify

1. Navigate to your resource's **General** tab
2. Locate the **Custom Docker Options** field
3. Add your entrypoint option along with any other custom options:
   ```bash
   --entrypoint /bin/sh --cap-add SYS_ADMIN
   ```
4. Save and redeploy your application

::: info Note
The entrypoint option is converted to Docker Compose format during deployment, supporting both Dockerfile and Docker Compose build packs.
:::