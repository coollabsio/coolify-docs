---
title: "Elasticsearch"
description: "Here you can find the documentation for hosting Elasticsearch with Coolify."
---

# Elasticsearch

![ElasticSearch](/images/services/elasticsearch-logo.svg)

## What is Elasticsearch?

Elasticsearch is an open-source search and analytics engine designed for fast, scalable data retrieval—ideal for handling large volumes of both structured and unstructured data.

## How to Deploy Elasticsearch on Coolify

There are two ways to deploy Elasticsearch on Coolify:

- **Elasticsearch as a standalone service** (no GUI)
- **Elasticsearch with Kibana** (GUI)

---

## Elasticsearch as a Standalone Service

1. Create a new resource on Coolify and select **Elasticsearch with Kibana** from the service list.
2. Click the **Deploy** button to pull the Docker images and start the containers.
3. Once the `Elasticsearch` service shows as healthy, you can access it via its assigned domain.
   > ⚠️ Note: This version does not include a GUI—you’ll need to interact with it via CLI tools or APIs.

---

## Deploy Elasticsearch with Kibana

1. Create a new resource on Coolify and select **Elasticsearch with Kibana** from the service list.
2. Click the **Deploy** button to pull the Docker images and start the containers.
3. Once the `Elasticsearch` service is running and the `Kibana Token Generator` shows an **exited** status:
   - Open the logs of the `Kibana Token Generator` service.
   - Copy the **Service Token** from the logs.
   - Paste the token into the `ELASTICSEARCH_SERVICEACCOUNTTOKEN` environment variable.
   - Restart the service (click the **Restart** button).
4. After both `Elasticsearch` and `Kibana` services are running healthy, visit the domain assigned to the service.
   - You’ll be presented with the Elastic login page.
   - **Username:** `elastic`  
     **Password:** value of the `SERVICE_PASSWORD_ELASTICSEARCH` environment variable.

If any of the above steps are unclear, you can refer to [this Pull Request](https://github.com/coollabsio/coolify/pull/6470), which includes a video walkthrough of the entire deployment process.

---

### Notes for Elasticsearch with Kibana

1. It can take over **2 minutes** for all services to fully start (depending on your server’s performance).
2. The JVM heap size is set to **512MB** by default to prevent Elasticsearch from exhausting server memory.
   > To increase this value, modify the environment variable:  
   > `ES_JAVA_OPTS=-Xms512m -Xmx512m` in the Docker Compose file.
3. The `Kibana Token Generator` service is designed to **run once and then exit**. This is expected behavior and does not impact the health of the Elastic or Kibana services.
4. Clustering is **disabled by default** via the `discovery.type=single-node` environment variable.
   > Update this setting if clustering is required.

---

## Useful Links

- [Official Website](https://www.elastic.co/?utm_source=coolify.io)
- [Official Documentation](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/install-kibana-with-docker?utm_source=coolify.io)
