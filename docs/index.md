---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Coolify"
  text: "Open Source PaaS"
  tagline: Self-host your own databases, services (like WordPress, Plausible Analytics, Ghost) and applications (like Next.js, Nuxt.js, Remix, SvelteKit) with ease.
  actions:
    - theme: brand
      text: Get Started
      color: '#6b16ed'
      link: /get-started/introduction
    - theme: alt
      text: View Source Code
      link: https://github.com/coollabsio/coolify
referral:
  title: "Get €20 Free Credit"
  url: "https://coolify.io/hetzner"
  text: "Don't have a server yet? Get started with Hetzner Cloud."
  description: "Use our referral link to get €20 in free credits at Hetzner!"

# Icons used below on features are from https://lucide.dev/icons/ feel free to change them or change their colors if needed
features:
  - title: Any Language
    details: Deploy static sites, APIs, backends, databases, and more with support for all major frameworks.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d1ce" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-xml"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
  - title: Any Server
    details: Deploy to any server — VPS, Raspberry Pi, EC2, your Laptop, and more via SSH.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dbb700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  - title: Any Use-Case
    details: Supports single servers, multi-server setups, and Docker Swarm clusters (K8s coming soon).
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b899ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-mouse-pointer"><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"/><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/></svg>
  - title: Any Service
    details: Deploy any Docker-compatible service, plus a wide range of one-click options.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d64b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
  - title: Push to Deploy
    details: Git integration with GitHub, GitLab, Bitbucket, Gitea, and other platforms.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#99bbff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-merge"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>
  - title: Free SSL certificates
    details: Automatically sets up and renews Let's Encrypt SSL certificates for custom domains.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-key"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><circle cx="10" cy="16" r="2"/><path d="m16 10-4.5 4.5"/><path d="m15 11 1 1"/></svg>
  - title: No Vendor Lock-In
    details: Your data and settings stay on your servers for full control and easy portability.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffc800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-keyhole-open"><circle cx="12" cy="16" r="1"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 9.33-2.5"/></svg>
  - title: Automatic DB Backups
    details: Back up data to S3-compatible storage and restore it with one click if needed.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a6da95" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database-zap"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 15 21.84"/><path d="M21 5V8"/><path d="M21 12L18 17H22L19 22"/><path d="M3 12A9 3 0 0 0 14.59 14.87"/></svg>
  - title: Webhooks
    details: Integrate with CI/CD tools like GitHub Actions, GitLab CI, or Bitbucket Pipelines.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-webhook"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/></svg>
  - title: Powerful API
    details: Automate deployments, manage resources, and integrate with your existing tools easily.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cog"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
  - title: Real-Time Terminal
    details: Run server commands directly from your browser in real-time.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#99a5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
  - title: Collaborative
    details: Share projects with your team, control roles, and manage permissions.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
  - title: Pull Request Deployments
    details: Deploy commits and pull requests separately for quick reviews and faster teamwork.
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#c6a0f6" stroke-linecap="round" stroke-linejoin="round" d="M5.5 12.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-4.5-9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-6.5 7l3-5.5m3 0l3 5.5"/></svg>
  - title: Server Automations
    details: Handles server setup tasks automatically after connection, saving you time.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#99ffd3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw-dot"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/><circle cx="12" cy="12" r="1"/></svg>
  - title: Monitoring
    details: Monitor deployments, servers, disk usage, and receive alerts for issues.
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>

    # Commented out the below code instead of deleting it because I'm not sure if we need it or not... nothing breaks after commenting out the code so seems like it is safe to remove.
    # Serdar take care of this one!!!
# landing:
#   title: "Coolify"
#   text: "Open source PaaS for self-hosting appss"
#   tagline: Self-host your own databases, services (like WordPress, Plausible Analytics, Ghost) and applications (like Next.js, Nuxt.js, Remix, SvelteKit) with ease.
#   features:
#     - title: Any Language
#       details: Compatible with a wide range of programming languages and frameworks.
#       icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#91d7e3" stroke-linecap="round" stroke-linejoin="round" d="M1.5 5.5H6a2 2 0 1 0-2-2m-2.5 5H12A2.5 2.5 0 1 0 9.5 6m-2 7A1.5 1.5 0 1 0 9 11.5H5.5m-4 0h2"/></svg>
#     - title: Any Server
#       details: You can deploy your resources to any server, including your own servers, VPS, Raspberry Pi etc..
#       icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#eed49f" stroke-linecap="round" stroke-linejoin="round" d="M2.85 9.301a.644.65 0 0 1-.502-1.06L8.72 1.605a.322.325 0 0 1 .554.3L8.039 5.82a.644.65 0 0 0 .605.878h4.506a.644.65 0 0 1 .502 1.06L7.28 14.395a.322.325 0 0 1-.554-.3l1.236-3.916a.644.65 0 0 0-.605-.878Z"/></svg>
#     - title: Containerization
#       details: Resources are containerized for better performance and security
#       icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#8aadf4" stroke-linecap="round" stroke-linejoin="round" d="M.5 8.5H11l.75-.5a5.35 5.35 0 0 1 0-3.5c1 .6 1 1.88 1.74 2c.77-.09 1.23.01 2 .52c0 0-.97 1.77-2.5 1.98c-1.93 3.65-4.5 5.5-6.98 5.5C0 14.5.5 8.5.5 8.5m1 0v-2m0 0h8m-6 2v-4m0 0h4m-2-2h2m-2 6v-6m2 6v-6m2 6v-2"/></svg>
#     - title: Notifications
#       details: Configurable alerts for CPU, memory, disk and deployments.
#       icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5a97f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
#     - title: Collaborative
#       details: Share your projects with your team members and work together on them
#       icon: <svg width="32" height="32" viewBox="0 0 256 256"><path fill="#f5bde6" d="M244.8 150.4a8 8 0 0 1-11.2-1.6A51.6 51.6 0 0 0 192 128a8 8 0 0 1-7.4-4.9 8 8 0 0 1 0-6.2 8 8 0 0 1 7.4-4.9 24 24 0 1 0-23.2-30 8 8 0 1 1-15.5-4 40 40 0 1 1 65.7 39.5 68 68 0 0 1 27.4 21.7 8 8 0 0 1-1.6 11.2M190.9 212a8 8 0 1 1-13.8 8 57 57 0 0 0-98.2 0 8 8 0 1 1-13.8-8 72 72 0 0 1 33.7-30 48 48 0 1 1 58.4 0 72 72 0 0 1 33.7 30M128 176a32 32 0 1 0-32-32 32 32 0 0 0 32 32m-56-56a8 8 0 0 0-8-8 24 24 0 1 1 23.2-30 8 8 0 1 0 15.5-4A40 40 0 1 0 37 117.5a68 68 0 0 0-27.4 21.7 8 8 0 1 0 12.8 9.6A51.6 51.6 0 0 1 64 128a8 8 0 0 0 8-8"/></svg>
#     - title: OAuth / OIDC
#       details: Supports multiple OAuth2 providers.
#       icon: <svg width="32" height="32" viewBox="0 0 16 16"><g fill="none" stroke="#cad3f5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10.5a4.5 4.5 0 1 0-4.02-2.48L1.5 12.5v2h2v-2h2v-2h2l.48-.48c.6.3 1.3.48 2.02.48"/><path d="M12 5a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1"/></g></svg>
#     - title: Automatic backups
#       details: Data is automatically backed up to any S3 compatible solution
#       icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#a6da95" stroke-linecap="round" stroke-linejoin="round" d="M8 6.5c3.59 0 6.5-1.4 6.5-2.68S11.59 1.5 8 1.5S1.5 2.54 1.5 3.82S4.41 6.5 8 6.5M14.5 8c0 .83-1.24 1.79-3.25 2.2s-4.49.41-6.5 0S1.5 8.83 1.5 8m13 4.18c0 .83-1.24 1.6-3.25 2c-2.01.42-4.49.42-6.5 0c-2.01-.4-3.25-1.17-3.25-2m0-8.3v8.3m13-8.3v8.3"/></svg>
#     - title: Powerful API
#       details: Robust API to automate deployments, manage resources etc..
#       icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#c6a0f6" stroke-linecap="round" stroke-linejoin="round" d="M5.5 12.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-4.5-9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-6.5 7l3-5.5m3 0l3 5.5"/></svg>
---


