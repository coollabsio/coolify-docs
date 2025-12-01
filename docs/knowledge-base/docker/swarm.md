---
title: "Docker Swarm"
description: "Deploy Coolify resources across Docker Swarm clusters with external registry requirements, manager and worker setup, and persistent storage configuration."
---

# Docker Swarm

::: danger Caution
***This is an experimental feature.***
:::

## Setup in Coolify

If you would like to use a Swarm to deploy your resources, you need to add the `Swarm Manager` to Coolify.

Optionally, you can add the `Swarm Workers` to Coolify. This will allow Coolify to do cleanups and other stuff on the `Swarm Workers`.

### Docker Registry

You need to have an external Docker Registry available to use a Swarm, as all workers need to be able to pull the images you built with Coolify.

- The Swarm Manager needs to push the image to the Docker Registry.
- The Swarm Workers need to pull the image from the Docker Registry.

So set your docker login credentials accordingly. More information [here](/knowledge-base/docker/registry).

## Install Swarm Cluster

> WIP
> This is just a brief guide to install a simple Docker Swarm cluster. For more information, please refer to the [official documentation](https://docs.docker.com/engine/swarm/).

### Prerequisites

- I will use [Hetzner](https://coolify.io/hetzner) (referral link) for this guide. You can use any other provider.
- You need at least 3 servers to create a Docker Swarm cluster with the same architecture (ARM or AMD64).
- 1 server for the manager node.
- 2 servers for the worker nodes (you can add more worker nodes if you want).
- Add private networking to all servers if possible.

### Install Docker

Install Docker on all servers. You can follow the [official documentation](https://docs.docker.com/engine/install/) or:

1. Install with Rancher script

```bash
curl https://releases.rancher.com/install-docker/24.0.sh | sh
```

2. Install with Docker script

```bash
curl https://get.docker.com | sh -s -- --version 24.0
```

> You only need to use one of the above commands.

### Configure Docker

On `all servers`, run the following command to start Docker.

```bash
systemctl start docker
systemctl enable docker
```

::: warning Caution
Hetzner specific configuration. Hetnzer servers use a MTU of 1450. You need to configure Docker to use the same MTU.

On the `manager`, run the following command to configure Docker.

```bash
mkdir -p /etc/docker
cat <<EOF > /etc/docker/daemon.json
{
  "default-network-opts": {
    "overlay": {
      "com.docker.network.driver.mtu": "1450"
    }
  }
}
EOF
systemctl restart docker
```
:::


### Create a Swarm cluster

`On the manager node`, run the following command to create a new cluster.

```bash
# MANAGER_IP = IP of the manager node. If you have private networking, use the private IP, like 10.0.0.x.
docker swarm init --advertise-addr <MANAGER_IP>

```

This command will output a command to join the cluster on the `worker nodes`.

It should look like something like this:

```bash
# DO NOT RUN THIS COMMAND, IT IS JUST AN EXAMPLE, HELLO!
docker swarm join --token SWMTKN-1-24zvxeydjarchy7z68mdawichvf684qvf8zalx3rmwfgi6pzm3-4ftqn9n8v98kx3phfqjimtkzx 10.0.0.2:2377
```

### Verify the cluster

Run the following command on the manager node to verify the cluster.

```bash
docker node ls
```

You should see something like this:

```bash
ID                            HOSTNAME        STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
ua38ijktbid70em257ymxufif *   swarm-manager   Ready     Active         Leader           24.0.2
7rss9rvaqpe9fddt5ol1xucmu     swarm-worker    Ready     Active                          24.0.2
12239rvaqp43gddtgfsdxucm2     swarm-worker    Ready     Active                          24.0.2

```

## Deploy with persistent storage

To be able to deploy a service with persistent storage, you need to have a shared volume on the `swarm-workers`. So the Swarm service could move the resources between the `swarm-workers`.

You can always use services like AWS EFS, NFS, GlusterFS, etc.

> WIP
