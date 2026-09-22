import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, 'docs')
const outputDir = path.join(root, 'content/docs')
const ignoredDirs = new Set(['public'])

const folderIndexAliases = new Map([
  ['applications/build-packs/overview', 'applications/build-packs/index.mdx'],
  ['applications/ci-cd/introduction', 'applications/ci-cd/index.mdx'],
  ['integrations/networking/cloudflare/tunnels/overview', 'integrations/networking/cloudflare/tunnels/index.mdx'],
  ['knowledge-base/overview', 'knowledge-base/index.mdx'],
  ['knowledge-base/proxy/traefik/overview', 'knowledge-base/proxy/traefik/index.mdx'],
  ['knowledge-base/proxy/caddy/overview', 'knowledge-base/proxy/caddy/index.mdx'],
  ['troubleshoot/overview', 'troubleshoot/index.mdx'],
])

const routeAliases = new Map(
  [...folderIndexAliases.keys()].map((route) => [`/${route}`, `/${path.posix.dirname(route)}`]),
)

const sidebarMetas = {
  '': {
    pages: [
      'index',
      '---Get Started---',
      'choose-your-path',
      'start-with-self-hosted',
      'start-with-cloud',
      'deploy-your-first-app',
      'deploy-your-first-database',
      'deploy-your-first-service',
      'internal-postgresql-upgrade',
      '---Resources---',
      'usage',
      'concepts',
      'screenshots',
      'videos',
      'sponsors',
      'support',
      'team',
      '---Contribute---',
      'contribute',
      'core',
      'applications',
      'services',
      'databases',
      'integrations',
      'knowledge-base',
      'api',
      'troubleshoot',
    ],
  },
  contribute: {
    title: 'Contribute',
    pages: ['coolify', 'service', 'documentation'],
  },
  core: {
    title: 'Core',
    root: true,
    pages: [
      '---Understand Coolify---',
      'what-is-coolify',
      'how-coolify-works',
      'selfhosted-cloud-comparison',
      'build-deployment-model',
      'docker-and-containers',
      'networking-in-coolify',
      'security-model',
      '---Manage Coolify---',
      'instance-management',
      'backup-and-recovery',
    ],
  },
  'core/instance-management': {
    title: 'Instance Management',
    pages: ['instance-settings', 'update', 'downgrade', 'uninstallation'],
  },
  'core/backup-and-recovery': {
    title: 'Backup and Recovery',
    pages: ['instance-backup', 'instance-restore'],
  },
  applications: {
    title: 'Applications',
    root: true,
    pages: [
      '---Frameworks---',
      'django',
      'jekyll',
      'laravel',
      'phoenix',
      'rails',
      'symfony',
      'nextjs',
      'vite',
      'vuejs',
      'nuxt',
      'svelte-kit',
      'vitepress',
      '---Build Packs---',
      'build-packs',
      '---CI/CD---',
      'ci-cd',
    ],
  },
  'applications/build-packs': {
    title: 'Build Packs',
    pages: ['static', 'nixpacks', 'railpack', 'dockerfile', 'docker-compose'],
  },
  'applications/build-packs/nixpacks': {
    pages: ['node-versioning'],
  },
  'applications/ci-cd': {
    title: 'CI/CD',
    pages: ['github', 'gitlab/integration', 'bitbucket/integration', 'gitea/integration', 'other-providers'],
  },
  'applications/ci-cd/github': {
    title: 'Github',
    pages: [
      'overview',
      'actions',
      'auto-deploy',
      'preview-deploy',
      'public-repository',
      'deploy-key',
      'setup-app',
      'switch-apps',
    ],
  },
  services: {
    title: 'Services',
    root: true,
    pages: ['overview', 'all'],
  },
  databases: {
    title: 'Databases',
    root: true,
    pages: ['ssl', 'backups', 'mysql', 'mariadb', 'postgresql', 'mongodb', 'redis', 'dragonfly', 'keydb', 'clickhouse'],
  },
  integrations: {
    title: 'Integrations',
    root: true,
    pages: [
      '---Networking---',
      'networking/cloudflare/tunnels',
      '---Security---',
      'security/cloudflare/ddos-protection',
      'external:[Crowdsec](https://www.crowdsec.net/blog/securing-automated-app-deployment-crowdsec-and-coolify)',
    ],
  },
  'integrations/networking': {
    title: 'Networking',
    pages: ['cloudflare'],
  },
  'integrations/networking/cloudflare': {
    title: 'Cloudflare',
    pages: ['tunnels'],
  },
  'integrations/networking/cloudflare/tunnels': {
    title: 'Cloudflare Tunnel',
    pages: ['index', 'all-resource', 'single-resource', 'server-ssh', 'full-tls'],
  },
  'integrations/security': {
    title: 'Security',
    pages: ['cloudflare'],
  },
  'integrations/security/cloudflare': {
    title: 'Cloudflare',
    pages: ['ddos-protection'],
  },
  'knowledge-base': {
    title: 'Knowledge Base',
    root: true,
    pages: [
      '---Internal---',
      'internal',
      '---Self-hosted Instance---',
      'monitoring',
      'notifications',
      'webhook-payloads',
      'self-update',
      'commands',
      'delete-user',
      'oauth',
      'sso',
      'create-root-user-with-env',
      'define-custom-docker-network-with-env',
      'custom-docker-registry',
      'custom-compose-overrides',
      'change-localhost-key',
      '---DNS & Domains---',
      'dns-configuration',
      'domains',
      '---Destinations---',
      'destinations/index',
      'destinations/create',
      'destinations/manage',
      '---Resources---',
      'environment-variables',
      'persistent-storage',
      'drain-logs',
      'rolling-updates',
      'health-checks',
      'nodejs-multi-core-scaling',
      'cron-syntax',
      '---How-Tos---',
      'how-to',
      '---Servers---',
      'server',
      '---S3---',
      's3',
      '---Docker---',
      'docker',
      '---Proxy---',
      'proxy',
      'faq',
    ],
  },
  'knowledge-base/internal': {
    title: 'Internal',
    pages: ['scalability', 'terminal'],
  },
  'knowledge-base/destinations': {
    title: 'Destinations',
    pages: ['create', 'manage'],
  },
  'knowledge-base/how-to': {
    title: 'How-Tos',
    pages: [
      'migrate-apps-different-host',
      'backup-restore-coolify',
      'hetzner-loadbalancing',
      'wordpress-multisite',
      'raspberry-pi-os',
      'macos-colima',
      'private-npm-registry',
      'ollama-with-gpu',
      'webstudio-with-hetzner',
    ],
  },
  'knowledge-base/server': {
    title: 'Servers',
    pages: [
      'introduction',
      'automated-cleanup',
      'build-server',
      'firewall',
      'multiple-servers',
      'sentinel',
      'non-root-user',
      'openssh',
      'oracle-cloud',
      'proxies',
      'patching',
      'terminal-access',
    ],
  },
  'knowledge-base/s3': {
    title: 'S3',
    pages: ['introduction', 'aws', 'r2', 'supabase'],
  },
  'knowledge-base/docker': {
    title: 'Docker',
    pages: ['compose', 'custom-commands', 'registry', 'swarm'],
  },
  'knowledge-base/proxy': {
    title: 'Proxy',
    pages: ['traefik', 'caddy'],
  },
  'knowledge-base/proxy/traefik': {
    title: 'Traefik',
    pages: [
      'basic-auth',
      'custom-ssl-certs',
      'dashboard',
      'custom-middlewares',
      'dynamic-config',
      'load-balancing',
      'dns-challenge',
      'wildcard-certs',
      'protect-services-with-authentik',
    ],
  },
  'knowledge-base/proxy/traefik/custom-middlewares': {
    pages: ['redirects'],
  },
  'knowledge-base/proxy/caddy': {
    title: 'Caddy',
    pages: ['basic-auth', 'dns-challenge'],
  },
  'api': {
    title: 'API Reference',
    root: true,
    pages: [
      '---Get Started---',
      'overview',
      'making-requests',
      '---Access & Security---',
      'authorization',
      'permissions',
      'ip-allowlist',
      '---Requests & Responses---',
      'rate-limits',
      'errors',
      '---Endpoint Reference---',
      '...endpoints',
    ],
  },
  troubleshoot: {
    title: 'Troubleshoot',
    root: true,
    pages: ['installation', 'applications', 'dashboard', 'docker', 'server', 'dns-and-domains'],
  },
  'troubleshoot/installation': {
    title: 'Installation',
    pages: ['install-script-failed', 'docker-install-failed'],
  },
  'troubleshoot/applications': {
    title: 'Applications',
    pages: ['bad-gateway', 'no-available-server', 'gateway-timeout', 'failed-to-get-token'],
  },
  'troubleshoot/dashboard': {
    title: 'Dashboard',
    pages: ['dashboard-inaccessible', 'dashboard-slow-performance', 'disable-2fa-manually'],
  },
  'troubleshoot/docker': {
    title: 'Docker',
    pages: ['expired-github-personal-access-token'],
  },
  'troubleshoot/server': {
    title: 'Server',
    pages: ['connection-issues', 'crash-during-build', 'two-factor-stopped-working', 'raspberry-crashes', 'validation-issues'],
  },
  'troubleshoot/dns-and-domains': {
    title: 'DNS & Domains',
    pages: ['wildcard-ssl-certs', 'lets-encrypt-not-working', 'certificate-resolver-doesnt-exist'],
  },
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)
    const relativeDir = toPosix(path.relative(sourceDir, fullPath))
    if (entry.isDirectory() && relativeDir === 'api/endpoints') {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...await walk(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

function splitCodeFences(markdown) {
  const parts = []
  const regex = /```[\s\S]*?```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: markdown.slice(lastIndex, match.index) })
    }

    parts.push({ type: 'code', value: match[0] })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < markdown.length) {
    parts.push({ type: 'text', value: markdown.slice(lastIndex) })
  }

  return parts
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function normalizeLink(url) {
  if (
    !url ||
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.startsWith('#')
  ) {
    return url
  }

  if (url === '/') return '/'

  let normalized = url
  if (normalized.startsWith('/docs/')) normalized = normalized.replace(/^\/docs/, '') || '/'
  if (!normalized.startsWith('/')) return normalized

  const [pathname, suffix = ''] = normalized.split(/(?=[?#])/, 2)
  return `${routeAliases.get(pathname) ?? pathname}${suffix}`
}

function normalizeAsset(url) {
  if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('/docs/')) return url
  if (url.startsWith('/images/')) return `/docs${url}`
  return url
}

function convertContainerOpen(raw) {
  const match = raw.match(/^:{3,4}\s*([a-zA-Z-]+)\s*(.*)$/)
  if (!match) return raw

  const kind = match[1].toLowerCase()
  const title = match[2]?.trim()

  if (kind === 'details') {
    return `\n<details>${title ? `\n<summary>${title}</summary>` : ''}\n`
  }

  const typeMap = {
    danger: 'error',
    warning: 'warn',
    tip: 'info',
    info: 'info',
    success: 'success',
    neutral: 'info',
  }
  const type = typeMap[kind] ?? 'info'
  const titleProp = title ? ` title="${escapeAttribute(title)}"` : ''
  return `\n<Callout type="${type}"${titleProp}>\n`
}

function convertContainers(text) {
  const stack = []
  const lines = text.split('\n')

  const converted = lines
    .map((line) => {
      if (/^:{3,4}\s*$/.test(line.trim())) {
        if (stack.length === 0) return ''
        const kind = stack.pop()
        return kind === 'details' ? '\n</details>\n' : '\n</Callout>\n'
      }

      const containerLine = line.trim().replace(/^[-*]\s+/, '')
      if (/^:{3,4}\s*[a-zA-Z-]+/.test(containerLine)) {
        const kind = containerLine.match(/^:{3,4}\s*([a-zA-Z-]+)/)?.[1]?.toLowerCase()
        stack.push(kind === 'details' ? 'details' : 'callout')
        return convertContainerOpen(containerLine)
      }

      return line
    })

  while (stack.length > 0) {
    const kind = stack.pop()
    converted.push(kind === 'details' ? '\n</details>\n' : '\n</Callout>\n')
  }

  return converted.join('\n')
}

function convertTextPart(text) {
  let converted = text

  converted = converted.replace(/<ZoomableImage\b/g, '<ZoomImage')
  converted = converted.replace(/<ServicesList\s*\/>/g, '<ServicesList />')
  converted = converted.replace(/<Badge\b[^>]*text=["']([^"']+)["'][^>]*\/>/g, '`$1`')
  converted = converted.replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g, '$1')
  converted = converted.replace(/\sclass=/g, ' className=')

  converted = converted.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (match, alt, url) => {
    const normalized = normalizeAsset(url)
    return `<ZoomImage src="${escapeAttribute(normalized)}" alt="${escapeAttribute(alt)}" />`
  })

  converted = converted.replace(/(\[[^\]]+\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g, (match, prefix, url, suffix) => {
    if (match.startsWith('!')) return match
    return `${prefix}${normalizeLink(url)}${suffix}`
  })

  converted = converted.replace(/(href=["'])(\/[^"']*)(["'])/g, (match, prefix, url, suffix) => {
    return `${prefix}${normalizeLink(url)}${suffix}`
  })

  converted = converted.replace(/(src=["'])(\/[^"']*)(["'])/g, (match, prefix, url, suffix) => {
    return `${prefix}${normalizeAsset(url)}${suffix}`
  })

  converted = converted.replaceAll('{', '&#123;').replaceAll('}', '&#125;')
  converted = converted
    .replaceAll('&#123;/*', '{/*')
    .replaceAll('* /&#125;', '*/}')
    .replaceAll('/&#125;', '/}')

  return converted
}

function convertMarkdown(markdown) {
  markdown = convertHomePage(markdown)
  markdown = ensureFrontmatterTitle(markdown)
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '')
  markdown = markdown.replace(/<script[\s\S]*?<\/script>/g, '')
  markdown = markdown.replace(/<OAOperation\b[^>]*\/>/g, 'API operation details are generated from the Coolify OpenAPI specification.')
  markdown = convertContainers(markdown)

  return splitCodeFences(markdown)
    .map((part) => part.type === 'code' ? convertCodePart(part.value) : convertTextPart(part.value))
    .join('')
}

function convertHomePage(markdown) {
  if (!/^---\n[\s\S]*?layout:\s*home/m.test(markdown)) {
    return markdown
  }

  return `---
title: Home
description: Welcome to Coolify Documentation
---

# Build & deploy with Coolify
Your handbook to owning and operating your infrastructure with Coolify.

## Get started
Set up Coolify and deploy your first app in minutes.

<MediaCardGroup>
  <MediaCard title="Quick start" imageSrc="/docs/images/home/quick-start.webp" href="/choose-your-path" />
  <MediaCard title="Deploy your first application" imageSrc="/docs/images/home/deploy-first-application.webp" href="/deploy-your-first-app" />
  <MediaCard title="API" imageSrc="/docs/images/home/api.webp" href="/api/overview" />
  <MediaCard title="CLI" imageSrc="/docs/images/home/cli.webp" href="/knowledge-base/commands" />
</MediaCardGroup>

## Deploy any language. Any framework.
If it runs in Docker, you can deploy it with Coolify.

<MediaCardGroup>
  <MediaCard title="Laravel" imageSrc="/docs/images/home/laravel.webp" href="/applications/laravel" />
  <MediaCard title="Next.js" imageSrc="/docs/images/home/nextjs.webp" href="/applications/nextjs" />
  <MediaCard title="Django" imageSrc="/docs/images/home/django.webp" href="/applications/django" />
  <MediaCard title="Ruby on Rails" imageSrc="/docs/images/home/rails.webp" href="/applications/rails" />
</MediaCardGroup>

[View all language and framework guides](/applications)

## Deploy any database
If it runs in Docker, you can deploy it with Coolify.

<MediaCardGroup>
  <MediaCard title="PostgreSQL" imageSrc="/docs/images/home/postgres.webp" href="/databases/postgresql" />
  <MediaCard title="MySQL" imageSrc="/docs/images/home/mysql.webp" href="/databases/mysql" />
  <MediaCard title="Redis" imageSrc="/docs/images/home/redis.webp" href="/databases/redis" />
  <MediaCard title="MongoDB" imageSrc="/docs/images/home/mongodb.webp" href="/databases/mongodb" />
</MediaCardGroup>

[View all database guides](/databases)

## Deploy any service
Run **300+** open-source software with our **single click** service templates.

<MediaCardGroup>
  <MediaCard title="n8n" imageSrc="/docs/images/home/n8n.webp" href="/services/n8n" />
  <MediaCard title="Strapi" imageSrc="/docs/images/home/strapi.webp" href="/services/strapi" />
  <MediaCard title="Convex" imageSrc="/docs/images/home/convex.webp" href="/services/convex" />
  <MediaCard title="WordPress" imageSrc="/docs/images/home/wordpress.webp" href="/services/wordpress" />
</MediaCardGroup>

[View all service templates](/services/all)

## Help & Support
Get help from the community and the Coolify team.

<MediaCardGroup>
  <MediaCard title="Discord community" imageSrc="/docs/images/home/discord-community.webp" href="/support" />
  <MediaCard title="Github discussions" imageSrc="/docs/images/home/github-discussions.webp" href="https://github.com/coollabsio/coolify/discussions" />
  <MediaCard title="Email" imageSrc="/docs/images/home/email.webp" href="/support" />
</MediaCardGroup>
`
}

function convertCodePart(code) {
  return code.replace(/^```([^\n]*)/, (match, rawLanguage) => {
    const first = rawLanguage.trim().split(/\s+/)[0]
    const aliases = {
      Dockerfile: 'dockerfile',
      ssh: 'bash',
      traefik: 'bash',
      dotenv: 'bash',
      env: 'bash',
      shellscript: 'bash',
      sh: 'bash',
    }
    const allowed = new Set(['bash', 'yaml', 'json', 'toml', 'sql', 'dockerfile', 'php', 'js', 'ts', 'diff'])
    const language = aliases[first] ?? first

    if (!language) return '```'
    return `\`\`\`${allowed.has(language) ? language : 'text'}`
  })
}

function ensureFrontmatterTitle(markdown) {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/)

  if (!frontmatterMatch) {
    return `---\ntitle: Untitled\ndescription: ${JSON.stringify(siteDescription())}\n---\n\n${markdown}`
  }

  if (/^title:/m.test(frontmatterMatch[1])) {
    return markdown
  }

  const body = markdown.slice(frontmatterMatch[0].length)
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? 'Untitled'
  const replacement = `---\ntitle: ${JSON.stringify(heading)}\n${frontmatterMatch[1]}\n---`
  return markdown.replace(frontmatterMatch[0], replacement)
}

function siteDescription() {
  return 'Self hosting with superpowers: an open-source and self-hostable Heroku, Netlify, and Vercel alternative.'
}

function titleFromSegment(segment) {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function sectionTitle(item) {
  const match = item.match(/^---(.+)---$/)
  return match?.[1]?.trim()
}

function titleForMetaItem(baseDir, item) {
  const normalized = item.replace(/\/index$/, '')
  const dir = [baseDir, normalized].filter(Boolean).join('/')
  return sidebarMetas[dir]?.title ?? titleFromSegment(path.posix.basename(normalized))
}

function normalizeMeta(dir, meta) {
  if (!meta.pages) return meta

  const pages = meta.pages.filter((item, index, pages) => {
    const title = sectionTitle(item)
    if (!title) return true

    const next = pages[index + 1]
    if (!next || sectionTitle(next) || next.endsWith('/index')) return true

    return title !== titleForMetaItem(dir, next)
  })

  return { ...meta, pages }
}

async function writeMeta() {
  await Promise.all(
    Object.entries(sidebarMetas).map(async ([dir, meta]) => {
      const output = path.join(outputDir, dir, 'meta.json')
      await mkdir(path.dirname(output), { recursive: true })
      await writeFile(output, JSON.stringify(normalizeMeta(dir, meta), null, 2), 'utf8')
    }),
  )
}

async function generate() {
  const files = await walk(sourceDir)
  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  await Promise.all(
    files.map(async (file) => {
      const relative = toPosix(path.relative(sourceDir, file))
      const routePath = relative.replace(/\.md$/, '')
      const outputRelative = folderIndexAliases.get(routePath)
        ?? (sidebarMetas[routePath] ? `${routePath}/index.mdx` : relative.replace(/\.md$/, '.mdx'))
      const output = path.join(outputDir, outputRelative)
      const raw = await readFile(file, 'utf8')

      await mkdir(path.dirname(output), { recursive: true })
      await writeFile(output, convertMarkdown(raw), 'utf8')
    }),
  )

  await writeMeta()
  console.log(`Generated ${files.length} Fumadocs content files in ${path.relative(root, outputDir)}.`)
}

generate().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
