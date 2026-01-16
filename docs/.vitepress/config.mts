import { fileURLToPath, URL } from 'node:url'
import yaml from 'vite-plugin-yaml'
import llmstxt from 'vitepress-plugin-llms'
import { defineConfig } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import spec from './theme/openapi.json' with { type: 'json' }
import container from 'markdown-it-container'
import { bundledLanguages } from 'shiki'
import { join, dirname } from 'node:path'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { loadEnv } from 'vitepress'
const env = loadEnv('', process.cwd())
const sidebar = useSidebar({ spec })

// Add SSH to bundled languages
bundledLanguages['ssh'] = {
  id: 'ssh',
  scopeName: 'source.ssh-config',
  path: join(dirname(fileURLToPath(import.meta.url)), '../../node_modules/shiki/languages/ssh-config.tmLanguage.json')
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "Coolify Docs",
  description: "Self hosting with superpowers: An open-source & self-hostable Heroku / Netlify / Vercel alternative.",
  appearance: 'dark', // 'dark' allows user to change theme, 'force-dark' doesn't allow user to change theme
  base: '/docs/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: env.VITE_SITE_URL ?? 'https://coolify.io/docs/'
  },

  transformHead: ({ pageData }) => {
    const canonicalUrl = `${env.VITE_SITE_URL ?? 'https://coolify.io/docs'}${pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2')}`
    return [
      ['link', { rel: 'canonical', href: canonicalUrl }]
    ]
  },

  transformPageData(pageData) {
    const baseUrl = env.VITE_SITE_URL ?? 'https://coolify.io/docs/'
    const defaultImage = 'https://coolcdn.b-cdn.net/assets/coolify/og-image-docs.png'
    const defaultDescription = 'Self hosting with superpowers: An open-source & self-hostable Heroku / Netlify / Vercel alternative.'

    // Build canonical URL for this page
    const pageUrl = `${baseUrl}${pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2')}`

    // Extract values with fallback chain
    const baseTitle = pageData.frontmatter.title || pageData.title || 'Coolify Docs'
    const title = baseTitle === 'Coolify Docs' ? baseTitle : `${baseTitle} | Coolify`
    const description = pageData.frontmatter.description || defaultDescription

    // Handle image with relative to absolute URL conversion
    const relativeImage = pageData.frontmatter.image
    const image = relativeImage
      ? `${baseUrl.replace(/\/$/, '')}${relativeImage.startsWith('/') ? relativeImage : '/' + relativeImage}`.replace(/\/docs\/docs\//, '/docs/')
      : defaultImage

    // Initialize head array if it doesn't exist
    pageData.frontmatter.head ??= []

    // Add Open Graph tags
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: pageUrl }],
      ['meta', { property: 'og:image', content: image }]
    )

    // Add Twitter Card tags
    pageData.frontmatter.head.push(
      ['meta', { property: 'twitter:title', content: title }],
      ['meta', { property: 'twitter:description', content: description }],
      ['meta', { property: 'twitter:url', content: pageUrl }],
      ['meta', { property: 'twitter:image', content: image }]
    )
  },

  head: [
    ['meta', { name: 'theme-color', content: '#000000' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'twitter:site', content: '@coolifyio' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/docs/coolify-logo-transparent.png', alt: "Coolify's Logo" }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['script', { defer: 'true', src: 'https://analytics.coollabs.io/js/script.tagged-events.js', 'data-domain': env.VITE_ANALYTICS_DOMAIN ?? 'coolify.io/docs' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    externalLinkIcon: true,
    carbonAds: {
      code: 'CW7IPKJJ',
      placement: 'coolifyio'
    },
    logo: '/coolify-logo-transparent.png',
    nav: [
      { text: 'Coolify Cloud', link: 'https://coolify.io/pricing/' },
      {
        text: 'Resources',
        items: [
          { text: 'Releases', link: 'https://github.com/coollabsio/coolify/releases' },
          { text: 'Support', link: 'https://coolify.io/' },
          { text: 'Sponsor us', link: 'https://coolify.io/sponsorships/' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    outline: [2, 4],

    editLink: {
      pattern: 'https://github.com/coollabsio/documentation-coolify/tree/next/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/coollabsio/coolify' },
      { icon: 'discord', link: 'https://coollabs.io/discord' },
      { icon: 'x', link: 'https://x.com/coolifyio' }
    ],

    sidebar: [
      {
        text: 'Get Started',
        collapsed: false,
        items: [
          { text: 'Introduction', link: '/get-started/introduction' },
          {
            text: 'Installation',
            link: '/get-started/installation',
            collapsed: false,
            items: [
              { text: 'Upgrade', link: '/get-started/upgrade' },
              { text: 'Downgrade', link: '/get-started/downgrade' },
              { text: 'Uninstallation', link: '/get-started/uninstallation' },
            ]
          },
          { text: 'Cloud', link: '/get-started/cloud' },
          { text: 'Usage', link: '/get-started/usage' },
          {
            text: 'Concepts', link: '/get-started/concepts',
            collapsed: true,
            items: [
              { text: 'Screenshots', link: '/get-started/screenshots' },
              { text: 'Videos', link: '/get-started/videos' },
            ]
          },
          { text: 'Team', link: '/get-started/team' },
          { text: 'Support', link: '/get-started/support' },
          { text: 'Sponsors', link: '/get-started/sponsors' },
          {
            text: 'Contribute',
            collapsed: true,
            items: [
              { text: 'Coolify', link: '/get-started/contribute/coolify' },
              { text: 'New Service', link: '/get-started/contribute/service' },
              { text: 'Documentation', link: '/get-started/contribute/documentation' },
            ],
          },

        ],
      },
      {
        text: 'Applications',
        collapsed: true,
        items: [
          {
            text: 'Overview',
            link: '/applications/index',
          },
          {
            text: 'Frameworks',
            items: [
              { text: 'Django', link: '/applications/django' },
              { text: 'Jekyll', link: '/applications/jekyll' },
              { text: 'Laravel', link: '/applications/laravel' },
              { text: 'Phoenix', link: '/applications/phoenix' },
              { text: 'Ruby on Rails', link: '/applications/rails' },
              { text: 'Symfony', link: '/applications/symfony' },
              { text: 'Next.js', link: '/applications/nextjs' },
              { text: 'Vite', link: '/applications/vite' },
              { text: 'Vue', link: '/applications/vuejs' },
              { text: 'Nuxt', link: '/applications/nuxt' },
              { text: 'SvelteKit', link: '/applications/svelte-kit' },
            ]
          },
          {
            text: 'Build Packs',
            link: '/applications/build-packs/overview',
            collapsed: true,
            items: [
              { text: 'Static', link: '/applications/build-packs/static' },
              {
                text: 'Nixpacks',
                link: '/applications/build-packs/nixpacks',
                collapsed: true,
                items: [
                  { text: 'Node Versioning', link: '/applications/build-packs/nixpacks/node-versioning' },
                ]
              },
              { text: 'Dockerfile', link: '/applications/build-packs/dockerfile' },
              { text: 'Docker Compose', link: '/applications/build-packs/docker-compose' },
            ]
          },
          {
            text: 'CI/CD',
            link: '/applications/ci-cd/introduction',
            collapsed: true,
            items: [
              {
                text: 'Github', collapsed: true, items: [
                  { text: 'Overview', link: '/applications/ci-cd/github/overview' },
                  { text: 'Actions', link: '/applications/ci-cd/github/actions' },
                  { text: 'Auto Deploy', link: '/applications/ci-cd/github/auto-deploy' },
                  { text: 'Preview Deploy', link: '/applications/ci-cd/github/preview-deploy' },
                  { text: 'Deploy Public Repository', link: '/applications/ci-cd/github/public-repository' },
                  { text: 'Setup Deploy Key', link: '/applications/ci-cd/github/deploy-key' },
                  { text: 'Setup Github App', link: '/applications/ci-cd/github/setup-app' },
                  { text: 'Switch Github Apps', link: '/applications/ci-cd/github/switch-apps' },
                ]
              },
              {
                text: 'Gitlab',
                link: '/applications/ci-cd/gitlab/integration',
              },
              {
                text: 'Bitbucket',
                link: '/applications/ci-cd/bitbucket/integration',
              },
              {
                text: 'Gitea',
                link: '/applications/ci-cd/gitea/integration',
              },
              {
                text: 'Other Providers',
                link: '/applications/ci-cd/other-providers',
              },
            ]
          },
        ],
      },
      {
        text: 'Services',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/services/introduction' },
          { text: 'All One-Click Services', link: '/services/overview' },
          { text: 'Services Directory', link: '/services/all' }
        ]
      },
      {
        text: 'Databases',
        collapsed: true,
        items: [
          {
            text: 'Overview',
            link: '/databases/index',
            items: [
              { text: 'Database SSL', link: '/databases/ssl' },
              { text: 'Backups', link: '/databases/backups' },
              { text: 'MySQL', link: '/databases/mysql' },
              { text: 'MariaDB', link: '/databases/mariadb' },
              { text: 'PostgreSQL', link: '/databases/postgresql' },
              { text: 'MongoDB', link: '/databases/mongodb' },
              { text: 'Redis', link: '/databases/redis' },
              { text: 'DragonFly', link: '/databases/dragonfly' },
              { text: 'KeyDB', link: '/databases/keydb' },
              { text: 'Clickhouse', link: '/databases/clickhouse' },
            ]
          }
        ],
      },
      {
        text: 'Integrations',
        collapsed: true,
        items: [
          {
            text: 'Cloudflare',
            collapsed: true,
            items: [
              {
                text: 'Tunnels',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/integrations/cloudflare/tunnels/overview' },
                  { text: 'All Resources', link: '/integrations/cloudflare/tunnels/all-resource' },
                  { text: 'Single Resource', link: '/integrations/cloudflare/tunnels/single-resource' },
                  { text: 'Server SSH Access', link: '/integrations/cloudflare/tunnels/server-ssh' },
                  { text: 'Full TLS/HTTPS', link: '/integrations/cloudflare/tunnels/full-tls' },
                ]
              },
              { text: 'DDoS Protection', link: '/integrations/cloudflare/ddos-protection' },
            ]
          },
        ],
      },
      {
        text: 'Knowledge Base',
        collapsed: true,
        items: [
          {
            text: 'Overview',
            link: '/knowledge-base/overview',
            items: [
              {
                text: 'Internal',
                collapsed: true,
                items: [
                  {
                    text: 'Scalability',
                    link: '/knowledge-base/internal/scalability'
                  },
                  {
                    text: 'Terminal',
                    link: '/knowledge-base/internal/terminal'
                  }
                ]
              },
              {
                text: 'Self-hosted Instance',
                collapsed: true,
                items: [
                  { text: 'Monitoring', link: '/knowledge-base/monitoring' },
                  { text: 'Notifications', link: '/knowledge-base/notifications' },
                  { text: 'Coolify Updates', link: '/knowledge-base/self-update' },
                  { text: 'Commands', link: '/knowledge-base/commands' },
                  { text: 'Delete User', link: '/knowledge-base/delete-user' },
                  { text: 'OAuth', link: '/knowledge-base/oauth' },
                  { text: 'Default Root User', link: '/knowledge-base/create-root-user-with-env' },
                  { text: 'Custom Docker Network', link: '/knowledge-base/define-custom-docker-network-with-env' },
                  { text: 'Custom Docker Registry', link: '/knowledge-base/custom-docker-registry' },
                  { text: 'Change Localhost Key', link: '/knowledge-base/change-localhost-key' },
                ]
              },
              {
                text: 'DNS & Domains',
                collapsed: true,
                items: [
                  { text: 'DNS Configuration', link: '/knowledge-base/dns-configuration' },
                  { text: 'Domains', link: '/knowledge-base/domains' },
                ]
              },
              {
                text: 'Destinations',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/knowledge-base/destinations/index' },
                  { text: 'Creating Destinations', link: '/knowledge-base/destinations/create' },
                  { text: 'Managing Destinations', link: '/knowledge-base/destinations/manage' },
                ]
              },
              {
                text: 'Resources',
                collapsed: true,
                items: [
                  { text: 'Environment Variables', link: '/knowledge-base/environment-variables' },
                  { text: 'Persistent Storage', link: '/knowledge-base/persistent-storage' },
                  { text: 'Drain Logs', link: '/knowledge-base/drain-logs' },
                  { text: 'Rolling Updates', link: '/knowledge-base/rolling-updates' },
                  { text: 'Health Checks', link: '/knowledge-base/health-checks' },
                  { text: 'Cron Syntax', link: '/knowledge-base/cron-syntax' },
                ]
              },
              {
                text: 'How-Tos',
                collapsed: true,
                items: [
                  { text: 'Migrate Applications', link: '/knowledge-base/how-to/migrate-apps-different-host' },
                  { text: 'Backup & Restore Coolify', link: '/knowledge-base/how-to/backup-restore-coolify' },
                  { text: 'Load-balancing on Hetzner', link: '/knowledge-base/how-to/hetzner-loadbalancing' },
                  { text: 'WordPress Multisite', link: '/knowledge-base/how-to/wordpress-multisite' },
                  { text: 'Raspberry Pi OS Setup', link: '/knowledge-base/how-to/raspberry-pi-os' },
                  { text: 'Private NPM Registry', link: '/knowledge-base/how-to/private-npm-registry' },
                  { text: 'Ollama with GPU', link: '/knowledge-base/how-to/ollama-with-gpu' },
                  { text: 'Webstudio with Hetzner', link: '/knowledge-base/how-to/webstudio-with-hetzner' },
                ]
              },
              {
                text: 'Servers',
                collapsed: true,
                items: [
                  { text: 'Introduction', link: '/knowledge-base/server/introduction' },
                  { text: 'Automated Cleanup', link: '/knowledge-base/server/automated-cleanup' },
                  { text: 'Build Server', link: '/knowledge-base/server/build-server' },
                  { text: 'Firewall', link: '/knowledge-base/server/firewall' },
                  { text: 'Multiple Servers', link: '/knowledge-base/server/multiple-servers' },
                  { text: 'Sentinel and Metrics', link: '/knowledge-base/server/sentinel' },
                  { text: 'Non-root User', link: '/knowledge-base/server/non-root-user' },
                  { text: 'OpenSSH', link: '/knowledge-base/server/openssh' },
                  { text: 'Oracle Cloud', link: '/knowledge-base/server/oracle-cloud' },
                  { text: 'Proxies', link: '/knowledge-base/server/proxies' },
                  { text: 'Server Patching', link: '/knowledge-base/server/patching' },
                  { text: 'Terminal Access', link: '/knowledge-base/server/terminal-access' },
                ]
              },
              {
                text: 'S3',
                collapsed: true,
                items: [
                  { text: 'Introduction', link: '/knowledge-base/s3/introduction' },
                  { text: 'AWS', link: '/knowledge-base/s3/aws' },
                  { text: 'R2', link: '/knowledge-base/s3/r2' },
                ]
              },
              {
                text: 'Docker',
                collapsed: true,
                items: [
                  { text: 'Compose', link: '/knowledge-base/docker/compose' },
                  { text: 'Docker Commands', link: '/knowledge-base/docker/custom-commands' },
                  { text: 'Registry', link: '/knowledge-base/docker/registry' },
                  { text: 'Swarm', link: '/knowledge-base/docker/swarm' },
                ]
              },
              {
                text: 'Proxy',
                collapsed: true,
                items: [
                  {
                    text: 'Traefik',
                    collapsed: true,
                    items: [
                      { text: 'Overview', link: '/knowledge-base/proxy/traefik/overview' },
                      { text: 'Basic Auth', link: '/knowledge-base/proxy/traefik/basic-auth' },
                      { text: 'Custom SSL Certificates', link: '/knowledge-base/proxy/traefik/custom-ssl-certs' },
                      { text: 'Dashboard', link: '/knowledge-base/proxy/traefik/dashboard' },
                      { text: 'Dynamic Configurations', link: '/knowledge-base/proxy/traefik/dynamic-config' },
                      { text: 'Load Balancing', link: '/knowledge-base/proxy/traefik/load-balancing' },
                      { text: 'Redirects', link: '/knowledge-base/proxy/traefik/redirects' },
                      { text: 'Wildcard SSL Certificates', link: '/knowledge-base/proxy/traefik/wildcard-certs' },
                      { text: 'Protect Services with Authentik', link: '/knowledge-base/proxy/traefik/protect-services-with-authentik' }
                    ]
                  },
                  {
                    text: 'Caddy',
                    collapsed: true,
                    items: [
                      { text: 'Overview', link: '/knowledge-base/proxy/caddy/overview' },
                      { text: 'Basic Auth', link: '/knowledge-base/proxy/caddy/basic-auth' },
                    ]
                  },
                ]
              },
              { text: 'FAQ', link: '/knowledge-base/faq' },
            ]
          }
        ],
      },
      {
        text: 'API Reference',
        collapsed: true,
        items: [
          {
            text: 'Authorization',
            link: '/api-reference/authorization',
          },
          ...sidebar.generateSidebarGroups({
            linkPrefix: '/api-reference/api/operations/',
          }).map((group) => ({
            ...group,
            collapsed: true
          }))
        ],
      },
      {
        text: 'Troubleshoot',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/troubleshoot/overview' },
          {
            text: 'Installation',
            collapsed: true,
            items: [
              { text: 'Coolify Installation Failed', link: '/troubleshoot/installation/install-script-failed' },
              { text: 'Docker Installation Failed', link: '/troubleshoot/installation/docker-install-failed' },
            ]
          },
          {
            text: 'Applications',
            collapsed: true,
            items: [
              { text: 'Bad Gateway (502)', link: '/troubleshoot/applications/bad-gateway.md' },
              { text: 'No Available Server (503)', link: '/troubleshoot/applications/no-available-server' },
              { text: 'Gateway Timeout (504)', link: '/troubleshoot/applications/gateway-timeout' },
              { text: 'Failed To Get Access Token During Deployment', link: '/troubleshoot/applications/failed-to-get-token' },
            ]
          },
          {
            text: 'Dashboard',
            collapsed: true,
            items: [
              { text: 'Inaccessible ', link: '/troubleshoot/dashboard/dashboard-inaccessible' },
              { text: 'Very Slow ', link: '/troubleshoot/dashboard/dashboard-slow-performance' },
              { text: 'Disable 2FA Manually', link: '/troubleshoot/dashboard/disable-2fa-manually' },
            ]
          },
          {
            text: 'Docker',
            collapsed: true,
            items: [
              { text: 'Expired GitHub Personal Access Token (PAT)', link: '/troubleshoot/docker/expired-github-personal-access-token' },
            ]
          },
          {
            text: 'Server',
            collapsed: true,
            items: [
              { text: 'Connection Unstable', link: '/troubleshoot/server/connection-issues' },
              { text: 'Crash During Build', link: '/troubleshoot/server/crash-during-build' },
              { text: '2FA Stopped Working', link: '/troubleshoot/server/two-factor-stopped-working' },
              { text: 'Raspberry Pi Crashes', link: '/troubleshoot/server/raspberry-crashes' },
              { text: 'Server Validation Issues', link: '/troubleshoot/server/validation-issues' },
            ]
          },
          {
            text: 'DNS & Domains',
            collapsed: true,
            items: [
              { text: 'Wildcard SSL not working', link: '/troubleshoot/dns-and-domains/wildcard-ssl-certs' },
              { text: "Let's Encrypt not working", link: '/troubleshoot/dns-and-domains/lets-encrypt-not-working' },
              { text: "Cert Resolver doesn't exist", link: '/troubleshoot/dns-and-domains/certificate-resolver-doesnt-exist' },
            ]
          },
        ],
      },
    ],

  },

  markdown: {
    config: (md) => {
      // Success callout
      md.use(container, 'success', {
        validate: (params) => {
          return params.trim().match(/^success\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^success\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return `<Callout type="success" title="${m ? m[1] : ''}">`
          } else {
            return '</Callout>'
          }
        }
      })
      // Tip callout
      md.use(container, 'tip', {
        validate: (params) => {
          return params.trim().match(/^tip\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^tip\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return `<Callout type="tip" title="${m ? m[1] : ''}">`
          } else {
            return '</Callout>'
          }
        }
      })
      // Warning callout
      md.use(container, 'warning', {
        validate: (params) => {
          return params.trim().match(/^warning\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return `<Callout type="warning" title="${m ? m[1] : ''}">`
          } else {
            return '</Callout>'
          }
        }
      })
      // Danger callout
      md.use(container, 'danger', {
        validate: (params) => {
          return params.trim().match(/^danger\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^danger\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return `<Callout type="danger" title="${m ? m[1] : ''}">`
          } else {
            return '</Callout>'
          }
        }
      })
      // Info callout
      md.use(container, 'info', {
        validate: (params) => {
          return params.trim().match(/^info\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^info\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return `<Callout type="info" title="${m ? m[1] : ''}">`
          } else {
            return '</Callout>'
          }
        }
      })
      // Neutral callout
      md.use(container, 'neutral', {
        validate: (params) => {
          return params.trim().match(/^neutral\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^neutral\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return `<Callout type="neutral" title="${m ? m[1] : ''}">`
          } else {
            return '</Callout>'
          }
        }
      })
      // Details accordion
      md.use(container, 'details', {
        validate: (params) => {
          return params.trim().match(/^details\s*(.*)$/)
        },
        render: (tokens, idx) => {
          const m = tokens[idx].info.trim().match(/^details\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
             return `<details class="text-sm rounded-xl border px-6 py-0 last:[&>*]:mb-4 my-4 text-zinc-600 dark:text-zinc-300" style="background-color: var(--coollabs-bg-zinc-300-5); border-color: var(--coollabs-border-zinc-300-20);"><summary class="font-semibold mb-2 cursor-pointer select-none text-zinc-800 dark:text-zinc-100">${m ? m[1] : ''}</summary>`
          } else {
            return '</details>'
          }
        }
      })
      md.use(tabsMarkdownPlugin)
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    // Configure Shiki with SSH language
    async shikiSetup(shiki) {
      await shiki.loadLanguage('ssh-config')
    },
    // Map ssh to ssh-config
    languageAlias: {
      ssh: 'ssh-config',
    }
  },

  rewrites: {},

  vite: {
    plugins: [
      yaml as any,
       llmstxt({
         ignoreFiles: [
           '/docs/api-reference/api/**/*',
           '**/api-reference/api/**/*'
         ],
       }),
      groupIconVitePlugin({
        customIcon: {
          bruno: 'vscode-icons:file-type-bruno',
          curl: 'simple-icons:curl',
        },
        defaultLabels: [
          'bruno',
          'curl',
          '.ts',
          '.js',
          '.py',
          '.php',
        ],
      }),
    ],
    assetsInclude: ['**/*.yml'],
    define: {
      'import.meta.env.VITE_KORREKTLY_BASE_URL': JSON.stringify(env.KORREKTLY_BASE_URL || env.VITE_KORREKTLY_BASE_URL || ''),
      'import.meta.env.VITE_KORREKTLY_API_TOKEN': JSON.stringify(env.KORREKTLY_API_TOKEN || env.VITE_KORREKTLY_API_TOKEN || ''),
      'import.meta.env.VITE_KORREKTLY_DATASET_ID': JSON.stringify(env.KORREKTLY_DATASET_ID || env.VITE_KORREKTLY_DATASET_ID || ''),
    },
    build: {
      chunkSizeWarningLimit: 5000
    },
    resolve: {
      alias: [
        {
          find: /^.*\/VPHero\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/Landing/HeroHeader.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPBadge\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPBadge.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPNavBar\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPNavBar.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPSidebar\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPSidebar.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPFeatures\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPFeatures.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPFeature\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPFeature.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPLocalNav\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPLocalNav.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPDocAside\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPDocAside.vue', import.meta.url)
          )
        }
      ]
    }
  }
})
