import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const servicesDir = path.join(root, 'content/docs/services')
export const imagesDir = path.join(root, 'public/images/services')

const ignoredServiceFiles = new Set([
  'all.mdx',
  'how-services-work.mdx',
  'index.mdx',
  'overview.mdx',
  'what-is-a-service.mdx',
])

const imageExtensions = new Set(['.svg', '.png', '.webp', '.jpg', '.jpeg'])
const iconSuffixes = ['-logo', '_logo', 'logo']

/**
 * @typedef {Object} ServiceRecord
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 * @property {string} description
 * @property {string} category
 * @property {boolean} [disabled]
 */

/**
 * Parse a scalar frontmatter value into a plain JavaScript value.
 *
 * @param {string} value
 * @returns {string | boolean}
 */
function parseScalar(value) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  if (trimmed === 'true') {
    return true
  }

  if (trimmed === 'false') {
    return false
  }

  return trimmed
}

/**
 * Extract top-level scalar frontmatter keys from a markdown document.
 *
 * @param {string} markdown
 * @param {string} file
 * @returns {Record<string, string | boolean>}
 */
function parseFrontmatter(markdown, file) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!match) {
    throw new Error(`${file} is missing frontmatter`)
  }

  const frontmatter = {}

  for (const line of match[1].split(/\r?\n/)) {
    const valueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)

    if (!valueMatch) {
      continue
    }

    const [, key, rawValue] = valueMatch
    frontmatter[key] = parseScalar(rawValue)
  }

  return frontmatter
}

/**
 * Normalize text for filename and slug comparisons.
 *
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Build a searchable index of available service image assets.
 *
 * @param {string[]} files
 * @returns {{ file: string, normalizedBasename: string }[]}
 */
function buildImageIndex(files) {
  return files
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .map((file) => {
      const extension = path.extname(file)
      const basename = path.basename(file, extension)

      return {
        file,
        normalizedBasename: normalize(basename),
      }
    })
}

/**
 * Resolve a service icon path from known image assets.
 *
 * @param {string} slug
 * @param {string} title
 * @param {{ file: string, normalizedBasename: string }[]} imageIndex
 * @returns {string}
 */
function resolveIcon(slug, title, imageIndex) {
  const candidates = [
    ...iconSuffixes.map((suffix) => `${slug}${suffix}`),
    slug,
    `${title}-logo`,
    title,
  ].map(normalize)

  for (const candidate of candidates) {
    const match = imageIndex.find((image) => image.normalizedBasename === candidate)

    if (match) {
      return `/docs/images/services/${match.file}`
    }
  }

  const fuzzy = imageIndex.find((image) => {
    const normalizedSlug = normalize(slug)

    return (
      image.normalizedBasename.startsWith(`${normalizedSlug}logo`) ||
      image.normalizedBasename.startsWith(normalizedSlug)
    )
  })

  if (fuzzy) {
    return `/docs/images/services/${fuzzy.file}`
  }

  return ''
}

/**
 * Fallback icon extraction from the service markdown body.
 *
 * @param {string} markdown
 * @returns {string}
 */
function extractMarkdownIcon(markdown) {
  const imageMatch =
    markdown.match(/<ZoomableImage[^>]+src=["']([^"']+)["']/) ||
    markdown.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/)

  if (!imageMatch) {
    return ''
  }

  const src = imageMatch[1]

  if (src.startsWith('/docs/images/services/')) {
    return src
  }

  if (src.startsWith('/images/services/')) {
    return `/docs${src}`
  }

  return ''
}

/**
 * Determine whether a service should be marked as disabled in generated data.
 *
 * @param {Record<string, string | boolean>} frontmatter
 * @param {string} markdown
 * @returns {boolean}
 */
function isDisabledService(frontmatter, markdown) {
  if (frontmatter.disabled === true) {
    return true
  }

  return /SERVICE (HIDDEN|NOT AVAILABLE|REMOVED FROM COOLIFY|TEMPORARILY DISABLED)/i.test(markdown)
}

/**
 * Collect normalized service metadata from service markdown files.
 *
 * @returns {Promise<ServiceRecord[]>}
 */
export async function collectServices() {
  const [serviceFiles, imageFiles] = await Promise.all([
    readdir(servicesDir),
    existsSync(imagesDir) ? readdir(imagesDir) : [],
  ])

  const imageIndex = buildImageIndex(imageFiles)
  const services = []

  for (const file of serviceFiles.sort()) {
    if (!file.endsWith('.mdx') || ignoredServiceFiles.has(file)) {
      continue
    }

    const slug = file.replace(/\.mdx$/, '')
    const markdown = await readFile(path.join(servicesDir, file), 'utf8')
    const frontmatter = parseFrontmatter(markdown, file)
    const title = frontmatter.title || slug
    const description = frontmatter.description || ''
    const category = frontmatter.category || 'Uncategorized'
    const icon = frontmatter.icon || resolveIcon(slug, title, imageIndex) || extractMarkdownIcon(markdown)
    const disabled = isDisabledService(frontmatter, markdown)

    services.push({
      name: title,
      slug,
      icon,
      description,
      category,
      ...(disabled ? { disabled } : {}),
    })
  }

  services.sort((a, b) => a.name.localeCompare(b.name, 'en'))

  return services
}
