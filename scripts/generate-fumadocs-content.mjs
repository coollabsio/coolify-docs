import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, 'docs')
const outputDir = path.join(root, 'content/docs')
const ignoredDirs = new Set(['public'])

const folderIndexAliases = new Map([
  ['applications/build-packs/overview', 'applications/build-packs/index.mdx'],
  ['applications/ci-cd/introduction', 'applications/ci-cd/index.mdx'],
  ['integrations/cloudflare/tunnels/overview', 'integrations/cloudflare/tunnels/index.mdx'],
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
      'get-started',
      'applications',
      'services',
      'databases',
      'integrations',
      'knowledge-base',
      'api-reference',
      'troubleshoot',
    ],
  },
  'get-started': {
    title: 'Get Started',
    pages: [
      '---Setup---',
      'introduction',
      'installation',
      'upgrade',
      'downgrade',
      'uninstallation',
      'cloud',
      '---Learn---',
      'usage',
      'concepts',
      'screenshots',
      'videos',
      '---Community---',
      'team',
      'support',
      'sponsors',
      '---Contribute---',
      'contribute',
    ],
  },
  'get-started/contribute': {
    title: 'Contribute',
    pages: ['coolify', 'service', 'documentation'],
  },
  applications: {
    title: 'Applications',
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
    pages: ['overview', 'all'],
  },
  databases: {
    title: 'Databases',
    pages: ['ssl', 'backups', 'mysql', 'mariadb', 'postgresql', 'mongodb', 'redis', 'dragonfly', 'keydb', 'clickhouse'],
  },
  integrations: {
    title: 'Integrations',
    pages: ['cloudflare', 'external:[Crowdsec](https://www.crowdsec.net/blog/securing-automated-app-deployment-crowdsec-and-coolify)'],
  },
  'integrations/cloudflare': {
    title: 'Cloudflare',
    pages: ['tunnels', 'ddos-protection'],
  },
  'integrations/cloudflare/tunnels': {
    title: 'Tunnels',
    pages: ['all-resource', 'single-resource', 'server-ssh', 'full-tls'],
  },
  'knowledge-base': {
    title: 'Knowledge Base',
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
  'api-reference': {
    title: 'API Reference',
    pages: ['authorization', 'api'],
  },
  troubleshoot: {
    title: 'Troubleshoot',
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
    if (entry.isDirectory() && relativeDir === 'api-reference/api') {
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
title: Coolify
description: Coolify is an open-source Platform as a Service (PaaS) for self-hosting databases, services, and applications with free SSL, backups, and Git integration.
full: true
---

<CoolifyHome />
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
