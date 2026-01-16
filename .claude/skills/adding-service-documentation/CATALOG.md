# Services List Catalog

How to update the services catalog in List.vue.

## File Location

```
docs/.vitepress/theme/components/Services/List.vue
```

The services array starts around **line 261** and contains all service entries.

## Adding a Service Entry

### Entry Format

```javascript
{
    name: 'ServiceName',
    slug: 'service-slug',
    icon: '/docs/images/services/servicename-logo.svg',
    description: 'Brief description of the service',
    category: 'Category'
}
```

### Field Specifications

#### name (required)
Display name with proper capitalization.

**Examples:**
- `'Appsmith'` - Single word
- `'Ghost'` - Simple name
- `'Home Assistant'` - Multiple words
- `'N8N'` - With numbers/special chars
- `'IT Tools'` - Acronyms capitalized

#### slug (required)
URL-friendly identifier, must match the markdown filename.

**Rules:**
- Lowercase only
- Use hyphens for spaces
- No special characters except hyphens
- Must match `docs/services/{slug}.md`

**Examples:**
- `'appsmith'` → `docs/services/appsmith.md`
- `'home-assistant'` → `docs/services/home-assistant.md`
- `'n8n'` → `docs/services/n8n.md`

#### icon (required)
Path to the service logo.

**Format:** `/docs/images/services/{name}-logo.{ext}`

**Examples:**
- `'/docs/images/services/appsmith-logo.svg'`
- `'/docs/images/services/ghost-logo.webp'`
- `'/docs/images/services/nextcloud-logo.png'`

**Important:**
- Path starts with `/docs/` (not `/public/`)
- Extension must match actual file
- Use `-logo` suffix in filename

#### description (required)
Brief service description (50-100 characters recommended).

**Tips:**
- Concise and clear
- Describes what the service does
- No marketing fluff
- Can be based on YAML `slogan` field

**Examples:**
- ✅ `'A low-code application platform for building internal tools.'`
- ✅ `'Open-source password manager for teams.'`
- ❌ `'The best and most amazing tool ever!'` (too marketing-y)
- ❌ `'A tool'` (too vague)

#### category (required)
Service category for filtering and organization.

See category list below.

#### ignore (optional)
Set to `true` to hide from services list.

```javascript
{
    name: 'ServiceName',
    slug: 'service-slug',
    icon: '/docs/images/services/service-logo.svg',
    description: 'Description',
    category: 'Category',
    ignore: true  // Service hidden from list
}
```

## Available Categories

Complete list of categories (alphabetically):

- **Administration** - Server management, dashboards, control panels
- **AI** - Artificial intelligence, machine learning, LLMs
- **Analytics** - Data analysis, metrics, statistics, business intelligence
- **Automation** - Workflow automation, task scheduling, no-code tools
- **Backup** - Backup solutions, data protection, disaster recovery
- **Bookmarks** - Bookmark managers, read-it-later services
- **Browser** - Web browsers in containers
- **Business** - CRM, ERP, invoicing, business management
- **CMS** - Content Management Systems, blogs, websites
- **Communication** - Chat, messaging, video conferencing
- **Crypto** - Cryptocurrency nodes, wallets, blockchain
- **Database** - Database tools, viewers, management interfaces
- **Design** - Design tools, prototyping, graphics
- **Development** - Developer tools, IDEs, API management
- **Documentation** - Wiki, knowledge base, documentation tools
- **Education** - Learning management, e-learning platforms
- **Email** - Email servers, clients, testing tools
- **Family** - Genealogy, family organization
- **File Management** - File organizers, converters, processors
- **File Sharing** - File sharing, transfer services
- **Finance** - Personal finance, budgeting, accounting
- **Forum** - Forum software, discussion boards
- **Gaming** - Game servers, gaming platforms
- **Health** - Health tracking, fitness, medical
- **Home** - Home automation, inventory, household management
- **IoT** - Internet of Things, device management
- **Marketing** - Email marketing, social media management
- **Media** - Media servers, streaming, photo/video management
- **Monitoring** - System monitoring, uptime tracking, observability
- **Networking** - VPNs, proxies, network tools
- **Notifications** - Push notifications, alerts, messaging
- **Productivity** - Note-taking, todo lists, organization
- **Project Management** - Task management, project planning, collaboration
- **RSS** - RSS readers, feed aggregators
- **Search** - Search engines, site search
- **Security** - Security tools, authentication, password managers
- **Social Media** - Social networks, social media tools
- **Storage** - File storage, sync, cloud storage
- **Utilities** - General utilities, converters, tools

### Adding New Categories

If a service doesn't fit existing categories:

1. Add a new category name (maintain alphabetical order when possible)
2. Use clear, descriptive category names
3. Check if similar categories exist first
4. Keep category names concise (1-2 words)

New categories automatically appear in the filter dropdown.

## Alphabetical Placement

Services should be inserted in **alphabetical order by name**.

**Example:**
```javascript
const services = [
    {
        name: 'Appsmith',
        slug: 'appsmith',
        // ...
    },
    {
        name: 'Appwrite',  // After Appsmith
        slug: 'appwrite',
        // ...
    },
    // ...
]
```

**Tip:** Search for a nearby service alphabetically to find the right insertion point.

## Complete Example

```javascript
{
    name: 'Appsmith',
    slug: 'appsmith',
    icon: '/docs/images/services/appsmith-logo.svg',
    description: 'A low-code application platform for building internal tools.',
    category: 'Development'
},
```

## Common Mistakes

❌ **Don't:**
- Forget the trailing comma after the object
- Use wrong quote types (use single quotes `'` in Vue files)
- Misspell the slug (must match filename)
- Use wrong icon path (missing `/docs/`, including `/public/`)
- Duplicate existing service names
- Forget to maintain alphabetical order

✅ **Do:**
- Add trailing comma after each entry
- Use single quotes consistently
- Verify slug matches markdown filename
- Test in dev server after adding
- Keep entries alphabetically sorted
- Use an existing category when possible

## Testing

After adding a service to List.vue:

```bash
# Start dev server
bun run dev

# Navigate to services page
# http://localhost:5173/docs/services/

# Verify:
# 1. Service appears in the list
# 2. Logo displays (not fallback icon)
# 3. Clicking opens /docs/services/{slug}
# 4. Category filter includes the service
# 5. Search finds service by name
```

## Troubleshooting

### Service not appearing
- Check JavaScript syntax (commas, quotes, brackets)
- Verify no `ignore: true` field
- Check if `services` array is properly closed
- Look for console errors in browser dev tools

### Wrong logo showing
- Verify `icon` path is correct
- Check file exists at that path
- Ensure extension matches file
- Test image path in browser

### Category not filtering
- Check category name matches exactly (case-sensitive)
- Verify category exists in the list
- Ensure category is spelled consistently

### Syntax errors
Common issues:
```javascript
// ❌ Missing comma
{
    name: 'Service1',
    category: 'Category'
}
{
    name: 'Service2',  // Error: missing comma above
    category: 'Category'
}

// ✅ Correct
{
    name: 'Service1',
    category: 'Category'
},  // Comma added
{
    name: 'Service2',
    category: 'Category'
}
```
