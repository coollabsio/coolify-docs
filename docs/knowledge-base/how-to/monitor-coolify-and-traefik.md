---
title: Monitor Coolify and Traefik
description: Step-by-step guide to monitor Coolify and Traefik with Grafana.
---

# Monitor Coolify and Traefik with Grafana
In this how-to, we will show you why monitoring is important and how to do it with Grafana.

# Why monitoring is important
Monitoring is crucial to keep your Coolify and Traefik stable and performant.  
Without insights into:
- CPU, RAM, disk or network usage on the host
- Individual Docker container resource usage
- Traefik requests and latency

Servers can crash, which could be prevented with monitoring.  
As an example:  
One of my production applications used `node-cron`. When we switched from summer to winter time,  
it went haywire and made an AMD Epyc server use 400% (4 cores) of the CPU and 100% of the RAM  
and I couldn't pinpoint the problem. With Grafana, you can spot those issues early.

With Grafana, you can setup alerts. When configured correctly you can get notification on for example:
- High resource usage
- DDOS (Traefik requests spiking)
- Docker containers who uses a lot of resources

## How to do it
Here we will show how to do it with a separate monitoring server, which connects through a  
internal network in Hetzner, but it can be used in other setups.

### 1. Prepare your monitoring server
You need a separate server to run Prometheus, Grafana, and optionally other monitoring tools (e.g., Uptime Kuma).
This is so if the Coolify server has high usage, all metrics will still be available.

#### Recommended specs
- CPU: 2+ cores
- RAM: 4GB+
- Disk: 20GB+ (for Prometheus metrics storage)
- OS: Any Linux distribution with Docker installed
- Network: Accessible to all servers you want to monitor (private/internal network recommended for security)

#### Network considerations
- Use a private/internal network or VPN to connect your monitoring server with all target servers.
- Open only the required ports on the monitoring server and target servers:
    - `9100` → Node Exporter (host resource metrics)
    - `6872` → cAdvisor (Docker container metrics, can vary)
    - `8080` → Traefik metrics API
    - `22` → SSH for management
- You can expose HTTP/HTTPS if you want to access dashboards externally (or use a reverse proxy with SSL).

Attach all servers you want to monitor to this network so Prometheus can scrape metrics from them.

### 2. Install Grafana
To install Grafana, you can follow the [detailed install guide](https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian/)  
But when you use Docker, you can run:
```bash
docker run  -d --name=grafana -p 3000:3000 -e "GF_SECURITY_ADMIN_USER=admin" -e "GF_SECURITY_ADMIN_PASSWORD=YOURSECRETPASSWORDHERE!" grafana/grafana-oss
```

### 3. Setup target servers
On the target servers, you need to have Docker already installed.
If not, you can add the server to Coolify, which will install Docker for you.

Then, you need to run two docker commands:  
**Resource monitoring**
```bash
docker run -d \
  --name=node_exporter \
  --restart unless-stopped \
  --net=host \
  --pid=host \
  -v "/:/host:ro,rslave" \
  quay.io/prometheus/node-exporter \
  --path.rootfs=/host
```
**Docker container monitoring**
```bash
docker run -d \
  --name=cadvisor \
  --restart unless-stopped \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=6872:8080 \
  gcr.io/cadvisor/cadvisor:latest
```

### 4. Configuring Traefik
If you want to monitor Traefik, you need to add the following to the following to the Traefik config under `command:`:
```yml
      - '--metrics.prometheus=true'
      - '--metrics.prometheus.addEntryPointsLabels=true'
      - '--metrics.prometheus.addServicesLabels=true'
      - '--metrics.prometheus.addRoutersLabels=true'
```

My full command section looks like:
```yml
    command:
      - '--ping=true'
      - '--ping.entrypoint=http'
      - '--api.dashboard=true'
      - '--entrypoints.http.address=:80'
      - '--entrypoints.https.address=:443'
      - '--entrypoints.http.http.encodequerysemicolons=true'
      - '--entryPoints.http.http2.maxConcurrentStreams=250'
      - '--entrypoints.https.http.encodequerysemicolons=true'
      - '--entryPoints.https.http2.maxConcurrentStreams=250'
      - '--entrypoints.https.http3'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--certificatesresolvers.letsencrypt.acme.httpchallenge=true'
      - '--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=http'
      - '--certificatesresolvers.letsencrypt.acme.storage=/traefik/acme.json'
      - '--api.insecure=false'
      - '--providers.docker=true'
      - '--providers.docker.exposedbydefault=false'
      - '--metrics.prometheus=true'
      - '--metrics.prometheus.addEntryPointsLabels=true'
      - '--metrics.prometheus.addServicesLabels=true'
      - '--metrics.prometheus.addRoutersLabels=true'
```
This config can be found in `servers -> serverName -> Proxy -> Traefik (Coolify Proxy)`
After this you need to restart the proxy for the changes to take effect (this will bring the applications down, adviced to test in a development environment).

### 5. Configuring `prometheus.yml`
On the `Monitoring` server, there is a file named `prometheus.yml`.  
Since I monitor host resources, Docker containers and Traefik, my config looks like:
```yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "Monitoring"
    static_configs:
      - targets: ["10.2.0.2:9100"]
        labels:
          name: "Monitoring"

  - job_name: "Coolify frontend"
    static_configs:
      - targets: ["10.2.0.3:9100"]
        labels:
          name: "Coolify frontend"

  - job_name: "Coolify Node 1"
    static_configs:
      - targets: ["10.2.0.5:9100"]
        labels:
          name: "Coolify Node 1"

  - job_name: "Coolify Node 2"
    static_configs:
      - targets: ["10.2.0.7:9100"]
        labels:
          name: "Coolify Node 2"

  - job_name: "Coolify Node 3"
    static_configs:
      - targets: ["10.2.0.9:9100"]
        labels:
          name: "Coolify Node 3"

  - job_name: "Mail"
    static_configs:
      - targets: ["10.2.0.6:9100"]
        labels:
          name: "Mail"

  - job_name: "Docker build - Repository"
    static_configs:
      - targets: ["10.2.0.8:9100"]
        labels:
          name: "Docker build - Repository"
          
  - job_name: "Coolify Node 1 Docker"
    static_configs:
      - targets: ["10.2.0.5:6872"]
        labels:
          name: "Coolify Node 1 Docker"

  - job_name: "Coolify Node 2 Docker"
    static_configs:
      - targets: ["10.2.0.7:6872"]
        labels:
          name: "Coolify Node 2 Docker"

  - job_name: "Coolify Node 3 Docker"
    static_configs:
      - targets: ["10.2.0.9:6872"]
        labels:
          name: "Coolify Node 3 Docker"

  - job_name: traefik
    static_configs:
      - targets:
          - 10.2.0.5:8080
          - 10.2.0.7:8080
          - 10.2.0.9:8080
```
You will need to change the IP's to the internal IP's which can be found in the `Monitoring` network (`ip a` will work to).  
After this, you need to restart Prometheus. I run it in Docker so i run `docker restart prometheus`

### 6. Adding datasource to Grafana
Inside Grafana's menu, you need to go to `Data sources` and create a new one.  
Here, you select `Prometheus` and fill in the following:
- Name: Prometheus
- Connection: `http://localhostOrPrivateIP:9090`
Then, you can click `Save & Test`.
If everything is correct, you should see `Successfully queried the Prometheus API.`.

### 7. Setup Grafana dashboards
When you go to dashboards in Grafana, you need to import some dashboards. This can be done by clicking:
`New -> Import`.  
Dashboards i used:
- `1860`: Node resources
- `893`: Docker containers
- `9566`: Traefik

When you import a dashboard, select `Prometheus` as data source.

### 8. Configuring alerts
I'm new to alerts, but i currently have the following alerts setup:
- High memory usage Discord alert
- High disk usage Discord alert
- High CPU usage Discord Alert
- Docker cpu usage Discord alert
- Docker high memory usage Discord alert
- Docker High network traffic Discord Alert
- Docker Network packet floot Discord alert

In the alerts menu, go to `Contact points`.
Here you can setup channels to be notified on. I configured a Discord webhook.

Then, create a new Alert Rule.
Select a folder to organize your alerts (for example Docker containers or Resource alerts).  
Select the Prometheus data source for your queries.
Then, add for each alert rule the correct queries:

- High CPU usage (Node Exporter)
```
100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100
```
- High Memory usage (Node Exporter)
```
100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)
```
- High Disk usage (Node Exporter)
```
100 * (1 - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"} / node_filesystem_size_bytes{fstype!~"tmpfs|overlay"})
```
- Docker CPU usage
```
rate(container_cpu_usage_seconds_total[5m]) * 100
```
- Docker Memory usage
```
container_memory_working_set_bytes{id!="/", id!="/system.slice"} / 1024 / 1024
```
- Docker Network traffic
```
rate(container_network_receive_bytes_total[5m]) * 8 / 1024 / 1024
```
- Docker Network packets
```
rate(container_network_receive_packets_total[5m])
```

Then, configure the threshold for each alert e.g., CPU > 90%, Memory > 85%, Docker network packets > 50,000).
Under Notifications, select the contact point you created (e.g., Discord webhook).