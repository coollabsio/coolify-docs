---
head:
  - - meta
    - name: description
      content: Coolify Documentation
  - - meta
    - name: keywords
      content: coolify self-hosting docker kubernetes vercel netlify heroku render digitalocean aws gcp azure
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: '@coolifyio'
  - - meta
    - name: twitter:title
      content: Coolify Documentation
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://coolify.io
  - - meta
    - property: og:title
      content: Coolify
  - - meta
    - property: og:description
      content: Self-hosting with superpowers.
  - - meta
    - property: og:site_name
      content: Coolify
  - - meta
    - property: og:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
---
# Developer Guide

## Running SSH commands on a server

First things first, let's define what is a `CoolifyTask`. It's a command (or multiple) that runs over SSH on a server, and that is tracked/monitored. This means it has a status, it has output (we can show it in real-time), and we can know all of this in a persisted `Activity`. It's a table for storing activity logs, and we use it in the workflow. It also has schemaless attributes, that might vary depending on the ActivityType.

### Helpers:

- `remoteProcess`: Async "CoolifyTask" that will run in the Queue
  - Arguments:
      - "ArrayOfCommands"  `string[]`
      - A `Server`: Target where the commands will be run
      - (optional 1) Any `Model` to be the `Activity->performedOn`
      - (optional 2) Type: 'Deployment' and value forTypeUuid

- `instantRemoteProcess`: Immediately run command under `Process::run` and return the output.
  - Arguments:
      - "ArrayOfCommands"  `string[]`
      - A `Server`: Target where the commands will be run
  - Note: `Pest Arch` must ensure this helper is just called when running in a queue.

### Understanding Coolify Task

- `app/Data/CoolifyTaskArgs.php`
  The parameters to execute a CoolifyTask, organized in a DTO.

- `app/Actions/CoolifyTask/PrepareCoolifyTask.php`
  This is where a Coolify Task gets started, with its arguments, and an Activity is created to further monitor/trace.

- `app/Jobs/CoolifyTask.php`
  This runs in a queue worker, by using a persisted `Activity` with everything needed to run.

- `app/Actions/CoolifyTask/RunRemoteProcess.php`
  The actual execution, and Activity updates, so that any monitoring/tracing gets updated.
