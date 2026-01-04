---
title: "Supabase"
description: "Deploy Supabase on Coolify as open-source Firebase alternative with Postgres database, authentication, storage, and real-time subscriptions."
---

![Supabase](https://user-images.githubusercontent.com/8291514/213727225-56186826-bee8-43b5-9b15-86e839d89393.png#gh-dark-mode-only)

## What is Supabase?

The open source Firebase alternative.

## Screenshots

<ZoomableImage src="/docs/images/services/supabase-selfhost.webp" alt="Supabase dashboard" />

## Notes

You can find your anonymous key in the **Environment Variables** area under **SERVICE_SUPABASEANON_KEY**.

## Public Port Access

**while you should access supabase through supavisor**, If you want to access your supabase directly you can do the following:  

Set **Supabase Db** to public

<ZoomableImage src="/docs/images/services/supabase-db-fix.webp" alt="Supabase dashboard" />

And Restart

## Connecting to the Database through supavisor 

In order to connect to your supabase DB pay attention to those enviroment variabels as you are supposed to connect to it through supavisor for efficient connection management: 
- `POOLER_TENANT_ID` ( **make sure to change this in production** )
- `POSTGRES_PORT` (default to 5432)  
- `POOLER_PROXY_PORT_TRANSACTION` (default to 6543)  

connection string sample:   
- Direct connection:  
`psql 'postgres://postgres.[POOLER_TENANT_ID]:[POSTGRES_PASSWORD]@[your-domain]:5432/postgres'`  
- Pooler connection:  
`psql 'postgres://postgres.[POOLER_TENANT_ID]:[POSTGRES_PASSWORD]@[your-domain]:6543/postgres'`


## Enabling Supabase AI assistance  

Note that supabase also allow AI integrations with an Open-AI key through the following environment variable:  
      - `OPENAI_API_KEY`


## Opening ports with ufw-docker

Finally, to allow external access to the PostgreSQL port in a Docker setup, you need to open the port in the firewall using the command:

```bash
ufw route allow proto tcp from any to any port 5432
```
NOTE: Change **5432** to your environment variable you satup previously `POSTGRES_PORT` OR `POOLER_PROXY_PORT_TRANSACTION` whichever you are trying to expose 

This rule ensures traffic can reach your PostgreSQL database through the Docker network. For more information, read the docs from [ufw-docker](https://github.com/chaifeng/ufw-docker).

### Using Hetzner's firewall UI

If your server is hosted on Hetzner, you may not need ufw-docker. Instead, you can open the relevant database port (e.g., 5432) directly using [Hetzner's firewall UI](https://docs.hetzner.com/cloud/firewalls/overview).



## Enforcing SSL connections  

 The pre-set template for supabase does have both files for public and private key mounted under the persistance storage tab. 
 - `server.key` file for your public key  
 - `server.crt` file for your certificate

 These are loaded through the environment variables under supavisor  
 - `GLOBAL_DOWNSTREAM_CERT_PATH=/etc/postcerts/server.crt`
 - `GLOBAL_DOWNSTREAM_KEY_PATH=/etc/postcerts/server.key`

 simply adding them doesn't enforce SSL but make it a valid option, in order to enforce it you must access the database as `supabase-admin` in away of your choice and access the following: 
 `Under DB:_supabase -> schema:_supavisor -> enforce_ssl` and set this to `true`

   <ZoomableImage src="/docs/images/services/supabase-enforce-ssl.webp" alt="Path To The Image" />  
   
## Links

- [Official Website](https://supabase.io)
- [GitHub](https://github.com/supabase/supabase)
- [Supabase offical selfhosting guide](https://supabase.com/docs/guides/self-hosting/docker)
