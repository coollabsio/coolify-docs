---
title: SigNoz
description: "An observability platform native to OpenTelemetry with logs, traces and metrics."
---

# SigNoz

<ZoomableImage src="/docs/images/services/signoz.svg" alt="SigNoz logo" />

## What is SigNoz

SigNoz is an open source observability platform native to OpenTelemetry with logs, traces and metrics.

## Configuring SigNoz

The following steps will guide you through the configuration of SigNoz once you have created the service in Coolify.

### URLs configuration

SigNoz being a whole observability platform, multiple ports need to be exposed for it to work.
The first one is the URL of the UI. You can find it in the "Service URL" field of the Signoz service, for example: `https://signoz.example.com:8080`

Then, you need to expose the Otel Collector, a service which is responsible for receiving traces, metrics and logs from your applications and services.
It supports many different formats such as GRPC, HTTP formats, Prometheus metrics, and [many logs formats](https://signoz.io/docs/userguide/logs/) (FluentBit/FluentD, syslogs, logs from cloud services, ...).

A different port is exposed for each receiver and we need to expose the relevant port for each receiver.
You have two strategies to do so:
- Configuring a different URL for each receiver.
- Directly exposing the ports to the host and the outside world.

Which option you prefer depends on your security needs and how you structure your domains.

#### One subdomain per receiver

This solution only requires you to map your subdomain to the Otel Collector service. We will cover the two default receivers, the HTTP and GRPC receivers.

1. Make sure your subdomains have been registered and point to your server, such as `https://signoz-grpc.example.com` and `https://signoz-http.example.com`.
2. Open the "Otel Collector" service settings.
3. Add your domains with the format `https://<subdomain>.example.com:<port in container>`, separated by commas. For example: `https://signoz-grpc.example.com:4317,https://signoz-http.example.com:4318`

If you want to expose additional ports / receivers, simply add a new address to the list.

#### Exposing the ports on the host

If you prefer to use a single domain for all receivers, you can edit the Docker Compose to directly expose the ports on the otel-collector container:

```yaml
services:
  # ...
otel-collector:
  image: signoz/signoz-otel-collector:latest
  container_name: signoz-otel-collector
  # ...
  ports:
  - 4317:4317 # GRPC Collector
  - 4318:4318 # HTTP Collector
 
  # ...
```

You can now append the port to your service URL to send data to receiver: `https://signoz.example.com:4318`

### Enabling SMTP emailing

SigNoz uses emailing for two things: inviting users and to [send alerts](https://signoz.io/docs/alerts/).

#### SigNoz emails

To enable SMTP emailing (including inviting new team members), you need to set the following variables from the Environment Variables tab of your Coolify service:

- `SIGNOZ_EMAILING_ENABLED` enables emailing capabilities in SigNoz.
- `SIGNOZ_EMAILING_SMTP_ADDRESS` is the address of the SMTP server to use, in the format `host:port`.
- `SIGNOZ_EMAILING_SMTP_FROM` is the email address to use in the From field.
- `SIGNOZ_EMAILING_SMTP_AUTH_USERNAME` and `SIGNOZ_EMAILING_SMTP_AUTH_PASSWORD` are used to authenticate with the SMTP server.

More environment variables are [available to use](https://signoz.io/docs/manage/administrator-guide/configuration/smtp-email-invitations/) to authenticate via Identity / Secret or use TLS instead of SmartTLS. Read [Passing environment variables not included in the template](passing-environment-variables-not-included-in-the-template) to learn how to add them.

#### Alert Manager emails

Email alerts can only be sent if an SMTP server is configured specifically for the alert manager. The global SMTP configuration and the Alert Manager configuration use different environment variables.

**Note**: SigNoz has a current known issue preventing email alerting configuration from being saved. You can track the progress of this [issue in their bug tracker](https://github.com/SigNoz/signoz/issues/8478).

To enable email alerts, you need to set the following variables from the Environment Variables tab of your Coolify service:

- `SIGNOZ_ALERTMANAGER_SIGNOZ_GLOBAL_SMTP__SMARTHOST` is the address of the SMTP server to use, in the format `host:port`.
- `SIGNOZ_ALERTMANAGER_SIGNOZ_GLOBAL_SMTP__FROM` is the email address to use in the From field.
- `SIGNOZ_ALERTMANAGER_SIGNOZ_GLOBAL_SMTP__AUTH__USERNAME` and `SIGNOZ_ALERTMANAGER_SIGNOZ_GLOBAL_SMTP__AUTH__PASSWORD` are used to authenticate with the SMTP server.

More environment variables are [available to use](https://signoz.io/docs/manage/administrator-guide/configuration/alertmanager/) to authenticate via Identity / Secret or use TLS instead of SmartTLS. Read [Passing environment variables not included in the template](passing-environment-variables-not-included-in-the-template) to learn how to add them.


## Permision issue while using non root user

The issue is mostly due to Coolify re-apply its user' ownership & chmod to the files mounted in the container. 

The solution here would be to make the files readable by everyone. Open a terminal on your server, go to `/data/coolify/services/<SERVICE ID>/` clickhouse and run the command `chmod o+r *`. This should allow Clickhouse to access the files as needed.

## Links

- [Official Documentation](https://signoz.io/docs/introduction/)
- [OpenTelemetry Documentation](https://opentelemetry.io/)
