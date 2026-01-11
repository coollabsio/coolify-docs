---
title: "Grafana"
description: "Deploy Grafana on Coolify for data visualization, monitoring dashboards, alerting, and metric analysis from multiple data sources and databases."
---

![Grafana](https://github.com/grafana/grafana/raw/main/docs/logo-horizontal.png#gh-light-mode-only)

## What is Grafana?

The open and composable observability and data visualization platform. Visualize metrics, logs, and traces from multiple sources like Prometheus, Loki, Elasticsearch, InfluxDB, Postgres and many more.

## Deployment Variants

Grafana is available in two deployment configurations in Coolify:

### Grafana (Default)
- **Database:** Embedded (SQLite)
- **Use case:** Simple monitoring setups, testing, or temporary dashboards
- **Components:** Single Grafana container with built-in database

### Grafana with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring persistent data storage, high availability, and better performance
- **Components:**
  - Grafana container
  - PostgreSQL 16 container
  - Automatic database configuration and health checks

## Features

Grafana allows you to query, visualize, alert on and understand your metrics no matter where they are stored. Create, explore, and share dashboards with your team and foster a data-driven culture:

- **Visualizations:** Fast and flexible client side graphs with a multitude of options. Panel plugins offer many different ways to visualize metrics and logs.
- **Dynamic Dashboards:** Create dynamic & reusable dashboards with template variables that appear as dropdowns at the top of the dashboard.
- **Explore Metrics:** Explore your data through ad-hoc queries and dynamic drilldown. Split view and compare different time ranges, queries and data sources side by side.
- **Explore Logs:** Experience the magic of switching from metrics to logs with preserved label filters. Quickly search through all your logs or streaming them live.
- **Alerting:** Visually define alert rules for your most important metrics. Grafana will continuously evaluate and send notifications to systems like Slack, PagerDuty, VictorOps, OpsGenie.
- **Mixed Data Sources:** Mix different data sources in the same graph! You can specify a data source on a per-query basis. This works for even custom datasources.

## Links

- [The official website](https://grafana.com/)
- [GitHub](https://github.com/grafana/grafana)
