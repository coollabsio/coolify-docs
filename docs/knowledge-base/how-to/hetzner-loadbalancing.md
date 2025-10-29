---
title: "Load Balancing on Hetzner"
description: "Deploy scalable load-balanced applications on Hetzner Cloud with Coolify including TLS termination, health checks, database setup, and firewall configuration."
---

# Load Balancing on Hetzner
Hetzner Cloud is a cloud hosting provider that offers a wide range of services. In this guide, we will show you how to deploy a load-balanced application with Coolify on Hetzner Cloud.

## Introduction

Your application is growing, and you need to scale it. One of the most common ways to scale an application is to use a load balancer. A load balancer distributes incoming traffic across multiple servers, ensuring that no single server is overwhelmed. This can help improve the performance and reliability of your application.

In this guide, we will show you how to deploy a load-balanced application with Coolify on Hetzner Cloud. We will use two (or more) servers to host our application and a load balancer to distribute incoming traffic. We will also show you how to set up a database server if you need one.

::: success Tip
The whole infrastructure costs around ~15€ per month.
:::

## Requirements

- A domain name managed by Hetzner Cloud
- 2 (or more) servers on Hetzner Cloud
- A load balancer on Hetzner Cloud
- Firewall rules to restrict access to your servers
- Optional: A database server on Hetzner Cloud


## Steps

1. ### Buy Servers

    First, you need to buy two (or more) servers on Hetzner Cloud. You can choose the server type and location based on your requirements. Make sure to choose servers with enough resources to run your application.

    ::: warning Caution
    Make sure you create and attach a private network to your servers. This will allow your servers to communicate with each other using a private network.
    :::

    If you don't have an account on Hetzner Cloud, you can sign up with this [referral link](https://coolify.io/hetzner).

2. ### Add & validate them in Coolify

    Once you have bought the servers, you need to add them to Coolify. You can do this by clicking on the `Add Server` button in the Coolify dashboard and following the instructions.

    Coolify will automatically install the necessary software on your servers.

3. ### Optional: Deploy your database

    It is preferable to have a separate database server for your application. Not just for performance reasons, but also for security reasons. Also in this way you can connect your applications to a centralized database server.

    Skip this step if you don't need a database server or if you already have one hosted elsewhere.

    Once you have bought the database server, and added it to Coolify, deploy your preferable database type (MySQL, PostgreSQL, etc.) on it.

    ::: warning Caution
    We won't use a reverse proxy in this guide. We will bind the database to the public IP address of the server. We will use a firewall to restrict access to the database server.

    You can stop them on the `Server` tab and switch to a `None` proxy type.
    :::

    Make sure you set the `Ports Mappings` correctly to allow your application servers to connect to the database server.

    - PostgreSQL: `5432:5432`
    - MySQL: `3306:3306`
    - MariaDB: `3306:3306`
    - MongoDB: `27017:27017`

4. ### Deploy your applications

    Now it's time to deploy your application on the app servers. Details of deploying your application will depend on the type of application you are deploying.

    With Coolify, you can attach more than one server to the same application. This will allow you to deploy your application on multiple servers.

    ::: warning Caution
    We won't use a reverse proxy in this guide. We will bind the application to the public IP address of the server, as the load balancer will handle the routing.

    You can stop them on the `Server` tab and switch to a `None` proxy type.
    :::

    Make sure you set the `Ports Mappings` correctly to forward your application ports to the public IP address of the server.

    If your application uses a database, make sure you update the database connection string to point to the database server.
    ::: success Tip
     Hetzner Cloud has a private network feature that allows you to connect your servers using a private network. This can help improve the security and performance of your application. 
     
     Make sure you enable the private network feature on your servers and use it in the database connection string.
    :::

    Test if your application is working correctly by accessing the public IP address and port of the server in your browser.

5. ### Add & configure the loadbalancer

    Now it's time to add a load balancer to distribute incoming traffic across your servers.

    This loadbalancer will do the following:
    - Distribute incoming traffic across your servers
    - Terminates TLS connections (makes your application secure with HTTPS and forwards the traffic to your servers over HTTP)
    - Health checks your servers and routes traffic to healthy servers

    Your application is running on `port 8000` on both servers and you have a domain name `example.com`.

    1. Go to the Hetzner Cloud Console and click on `Load Balancers` in the left sidebar.
    2. Click on the `Create Load Balancer` button.
    3. Select a region where your servers are located.
    4. Select the private network that you have created for your servers.
    5. Select all servers in the targets section. **Important: `(use the private network)`.**
    6. In the services, delete the default service and add a `TLS Termination` predefined service.
    7. As `Destination Port` enter `8000` (source port should be `443`).
    8. Add a certificate for your domain name. It will generate a certificate for your domain name using Let's Encrypt.
    9. In the `health check` section, configure the health check endpoint to your application health check endpoint. (just an endpoint that returns `200 OK`).
    10. Optional: Sticky sessions can be enabled, which will make sure that a user is always routed to the same server for a time period, otherwise, the load balancer will distribute the traffic randomly across your servers.
    11. Choose an algorithm.
    12. And finally name your load balancer and click on `Create & Buy now`.

    Wait for the load balancer to be created and healthy. Once it's healthy, you can check if your application is accessible via the loadbalancer's IP address.

6. ### Setup DNS

    Now it's time to point your domain name to the `load balancer's IP address`. You can do this by adding an `A` record to your domain name provider's DNS settings.

    1. Go to your DNS settings.
    2. Add an `A` record with the domain name and the value of the load balancer's IP address.
    3. Save the changes and wait for the DNS changes to propagate.

    Once the DNS changes have propagated, you should be able to access your application using your domain name.

7. ### Setup Firewall

    Hetzner Cloud offers a firewall feature that allows you to restrict access to your servers. We will use this feature to restrict access to your servers.

    As the load balancer communicates with your servers over the private network, we only need to add rules for the public IP addresses.

    The `Inbound` rules includes everything that is allowed. Everyting else is blocked by default.

    1. Go to the Hetzner Cloud Console and click on `Firewalls` in the left sidebar.
    2. Click on the `Create Firewall` button.
    3. Add SSH access rule for your IP address to the `Inbound` rules.
    4. Add your servers to the `Apply rule` section.
    5. Name your firewall and click on `Create Firewall`.

    ::: success Tip
    Optional: You can add more rules to allow access to specific ports or IP addresses if needed.
    :::
