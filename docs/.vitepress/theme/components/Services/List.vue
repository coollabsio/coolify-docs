<style scoped>
.default-soft {
    background: rgba(101, 117, 133, 0.16);
    border-color: #3c3f44;
}

/* Purple checkboxes */
input[type="checkbox"] {
    accent-color: #9333ea;
    /* purple-600 */
}

.dark input[type="checkbox"] {
    accent-color: #8b5cf6;
    /* purple-500 */
}

.search {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #fff;
    transition: border-color 0.3s ease;
    font-size: 14px;
}

.dark .search {
    border-color: #374151;
    background-color: #1f2937;
    color: #f9fafb;
}

/* Responsive search input */
@media (max-width: 640px) {
    .search {
        padding: 10px 12px;
        font-size: 16px;
        /* Prevents zoom on iOS */
    }
}

@media (max-width: 480px) {
    .search {
        padding: 12px 16px;
        font-size: 16px;
    }
}

.select {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #fff;
    transition: border-color 0.3s ease;
    font-size: 14px;
    min-width: 120px;
}

.dark .select {
    border-color: #374151;
    background-color: #1f2937;
    color: #f9fafb;
}

/* Responsive select dropdown */
@media (max-width: 640px) {
    .select {
        padding: 10px 12px;
        font-size: 16px;
        min-width: 100px;
    }
}

@media (max-width: 480px) {
    .select {
        padding: 12px 16px;
        font-size: 16px;
        min-width: 80px;
    }
}

/* Responsive container layout */
@media (min-width: 640px) {
    .input-container {
        flex-direction: row;
        gap: 1rem;
    }

    .input-container .search {
        max-width: 20rem;
    }

    .input-container .button-group {
        flex-direction: row;
    }

    .input-container .select {
        width: 12rem;
    }

    .dropdown-content {
        left: 0;
        width: 12rem;
    }
}

/* Responsive dropdown content */
@media (max-width: 640px) {
    .dropdown-content {
        font-size: 14px;
        padding: 8px;
    }

    .dropdown-content label {
        padding: 10px 8px;
    }
}

@media (max-width: 480px) {
    .dropdown-content {
        font-size: 16px;
        padding: 12px;
    }

    .dropdown-content label {
        padding: 12px 10px;
    }
}

.select:hover {
    border-color: #8b5cf6;
}

.dark .select:hover {
    border-color: #a78bfa;
}

.select:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.dark .select:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.2);
}

.bg-white {
    background-color: #fff;
}

.dark .bg-white {
    background-color: #374151;
}

.category {
    @apply space-y-4;
}

.category h2 {
    @apply text-xl font-semibold mb-4 text-blue-600;
}

.dark .category h2 {
    @apply text-blue-400;
}

.service-card {
    border-bottom-color: rgb(46, 46, 50);
}

.grid {
    display: grid;
    width: 100%;
    grid-auto-rows: minmax(200px, auto);
}

/* Override for not found cards */
.services-grid.not-found-grid {
    grid-auto-rows: auto;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

/* Responsive grid columns */
@media (min-width: 640px) {
    .services-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 768px) {
    .services-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (min-width: 1024px) {
    .services-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

.gap-6 {
    gap: 1.5rem;
}

.services-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.services-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.grid-container {
    display: grid;
    grid-template-rows: auto;
    min-height: 100vh;
    align-content: start;
}

/* Image loading states */
.image-loading {
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out;
}

.image-error {
    opacity: 0.8;
    filter: grayscale(1);
    transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out;
}

.image-loaded {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
}

/* Smooth image transitions */
img {
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

img:hover {
    transform: scale(1.05);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const services = [
     {
        name: 'Siyuan',
        slug: 'siyuan',
        icon: '/docs/images/services/siyuan.svg',
        description: 'A privacy-first, self-hosted, fully open source personal knowledge management software, written in typescript and golang.',
        category: 'Productivity'
    },
    {
        name: 'Umami',
        slug: 'umami',
        icon: '/docs/images/services/umami-logo.svg',
        description: 'A lightweight, open-source web analytics tool that prioritizes user privacy by not using cookies.',
        category: 'Analytics'
    },
    {
        name: 'Plausible',
        slug: 'plausible',
        icon: '/docs/images/services/plausible-logo.svg',
        description: 'A lightweight, open-source web analytics tool that prioritizes user privacy by not using cookies.',
        category: 'Analytics',
        ignore: true
    },
    {
        name: 'Rybbit',
        slug: 'rybbit',
        icon: '/public/images/services/rybbit.svg',
        description: 'A lightweight, open-source web analytics tool that prioritizes user privacy by not using cookies.',
        category: 'Analytics'
    },
    {
        name: 'Activepieces',
        slug: 'activepieces',
        icon: '/docs/images/services/activepieces-logo.png',
        description: 'Open source no-code business automation.',
        category: 'Automation'
    },
    {
        name: 'Actual Budget',
        slug: 'actualbudget',
        icon: '/docs/images/services/actualbudget-logo.webp',
        description: 'A local-first personal finance tool based on zero-based budgeting.',
        category: 'Finance'
    },
    {
        name: 'Affine',
        slug: 'affine',
        icon: '/docs/images/services/affine-logo.webp',
        description: 'Open-source knowledge base and workspace combining docs, whiteboards, and databases.',
        category: 'Productivity'
    },
    {
        name: 'AnythingLLM',
        slug: 'anythingllm',
        icon: '/docs/images/services/anythingllm-logo.svg',
        description: 'An open-source LLM client that empowers developers to build and scale workflows quickly.',
        category: 'AI'
    },
    {
        name: 'Apprise API',
        slug: 'apprise-api',
        icon: '/docs/images/services/appriseapi-logo.png',
        description: 'RESTful API for Apprise notification library.',
        category: 'Development'
    },
    {
        name: 'Appsmith',
        slug: 'appsmith',
        icon: '/docs/images/services/appsmith-logo.svg',
        description: 'A low-code application platform for building internal tools.',
        category: 'Development'
    },
    {
        name: 'Appwrite',
        slug: 'appwrite',
        icon: '/docs/images/services/appwrite-logo.svg',
        description: 'A backend-as-a-service platform that simplifies the web & mobile app development.',
        category: 'Development'
    },
    {
        name: 'Argilla',
        slug: 'argilla',
        icon: '/docs/images/services/argilla-logo.svg',
        description: 'An open-source platform for building, training, and evaluating conversational AI models.',
        category: 'AI'
    },
    {
        name: 'Audiobookshelf',
        slug: 'audiobookshelf',
        icon: '/docs/images/services/audiobookshelf-logo.svg',
        description: 'Self-hosted audiobook and podcast server.',
        category: 'Media'
    },
    {
        name: 'Authentik',
        slug: 'authentik',
        icon: '/docs/images/services/authentik-logo.png',
        description: 'An open-source Identity Provider, focused on flexibility and versatility.',
        category: 'Security'
    },
    {
        name: 'Baby Buddy',
        slug: 'babybuddy',
        icon: '/docs/images/services/babybuddy-logo.png',
        description: 'It helps parents track their baby\'s daily activities, growth, and health with ease.',
        category: 'Health'
    },
    {
        name: 'Beszel',
        slug: 'beszel',
        icon: '/docs/images/services/beszel-logo.svg',
        description: 'Lightweight server monitoring hub with historical data, docker stats, and alerts.',
        category: 'Monitoring'
    },
    {
        name: 'Bluesky PDS',
        slug: 'bluesky-pds',
        icon: '/docs/images/services/bluesky-logo.svg',
        description: 'Bluesky PDS (Personal Data Server) for decentralized social networking.',
        category: 'Social Media'
    },
    {
        name: 'Bitcoin Core',
        slug: 'bitcoin-core',
        icon: '/docs/images/services/bitcoin-logo.svg',
        description: 'Bitcoin Core full node software.',
        category: 'Crypto'
    },
    {
        name: 'BookStack',
        slug: 'bookstack',
        icon: '/docs/images/services/bookstack-logo.png',
        description: 'Self-hosted wiki-style documentation platform.',
        category: 'Documentation'
    },
    {
        name: 'Browserless',
        slug: 'browserless',
        icon: '/docs/images/services/browserless-logo.svg',
        description: 'Headless Chrome as a service.',
        category: 'Development'
    },
    {
        name: 'BudgE',
        slug: 'budge',
        icon: '/docs/images/services/budge-logo.png',
        description: 'A budgeting personal finance app.',
        category: 'Finance'
    },
    {
        name: 'Budibase',
        slug: 'budibase',
        icon: '/docs/images/services/budibase-logo.svg',
        description: 'Low-code platform for building internal tools and business apps.',
        category: 'Development'
    },
    {
        name: 'Bugsink',
        slug: 'bugsink',
        icon: '/docs/images/services/bugsink-logo.webp',
        description: 'Self-hosted Error Tracking',
        category: 'Development'
    },
    {
        name: 'Cal.com',
        slug: 'calcom',
        icon: '/docs/images/services/calcom-logo.svg',
        description: 'Open-source Calendly alternative for scheduling meetings.',
        category: 'Productivity'
    },
    {
        name: 'Calibre-web',
        slug: 'calibre-web',
        icon: '/docs/images/services/calibreweb-logo.svg',
        description: 'Web app for browsing, reading and downloading eBooks from a Calibre database.',
        category: 'Media'
    },
    {
        name: 'Cap',
        icon: '/public/images/services/cap.svg',
        description: 'Cap is the open source alternative to Loom. Lightweight, powerful, and cross-platform. Record and share in seconds.',
        category: 'Media'
    },
    {
        name: 'Castopod',
        slug: 'castopod',
        icon: '/docs/images/services/castopod-logo.svg',
        description: 'Open-source podcast hosting platform.',
        category: 'Media'
    },
    {
        name: 'Changedetection',
        slug: 'changedetection',
        icon: '/docs/images/services/changedetection-logo.png',
        description: 'Website change detection monitor and notifications.',
        category: 'Monitoring'
    },
    {
        name: 'Chroma',
        slug: 'chroma',
        icon: '/docs/images/services/chroma-logo.svg',
        description: 'Open-source, AI-native vector database for building applications with embeddings.',
        category: 'AI'
    },
    {
        name: 'Chaskiq',
        slug: 'chaskiq',
        icon: '/docs/images/services/chaskiq-logo.png',
        description: 'Open source customer engagement platform.',
        category: 'Business'
    },
    {
        name: 'Chatwoot',
        slug: 'chatwoot',
        icon: '/docs/images/services/chatwoot-logo.svg',
        description: 'Open-source customer engagement suite.',
        category: 'Business'
    },
    {
        name: 'Checkmate',
        slug: 'checkmate',
        icon: '/docs/images/services/checkmate-logo.png',
        description: 'Website monitoring and uptime service.',
        category: 'Monitoring'
    },
    {
        name: 'ClassicPress',
        slug: 'classicpress',
        icon: '/docs/images/services/classicpress-logo.svg',
        description: 'A business-focused CMS with a strong community.',
        category: 'CMS'
    },
    {
        name: 'CloudBeaver',
        slug: 'cloudbeaver',
        icon: '/docs/images/services/cloudbeaver-logo.png',
        description: 'Universal database tool with web interface.',
        category: 'Development'
    },
    {
        name: 'Cloudflared',
        slug: 'cloudflared',
        icon: '/docs/images/services/cloudflared-logo.svg',
        description: 'Cloudflare Tunnel client.',
        category: 'Networking'
    },
    {
        name: 'Cockpit',
        slug: 'cockpit',
        icon: '/docs/images/services/cockpit-logo.svg',
        description: 'Web-based server administration interface.',
        category: 'Administration'
    },
    {
        name: 'Code Server',
        slug: 'code-server',
        icon: '/docs/images/services/codeserver-logo.svg',
        description: 'Run VS Code on any machine anywhere and access it in the browser.',
        category: 'Development'
    },
    {
        name: 'ConvertX',
        slug: 'convertx',
        icon: '/docs/images/services/convertx-logo.png',
        description: 'File conversion service supporting multiple formats.',
        category: 'Utilities'
    },
    {
        name: 'Convex',
        slug: 'convex',
        icon: '/docs/images/services/convex-logo.svg',
        description: 'Backend platform for web developers.',
        category: 'Development'
    },
    {
        name: 'Cryptgeon',
        slug: 'cryptgeon',
        icon: '/docs/images/services/cryptgeon-logo.png',
        description: 'Secure note sharing service with self-destructing messages.',
        category: 'Security'
    },
    {
        name: 'CyberChef',
        slug: 'cyberchef',
        icon: '/docs/images/services/cyberchef-logo.jpeg',
        description: 'Data analysis and manipulation tool for cybersecurity.',
        category: 'Security'
    },
    {
        name: 'Dashboard',
        slug: 'dashboard',
        icon: '/docs/images/services/dashboard-logo.svg',
        description: 'A simple dashboard for your server.',
        category: 'Administration'
    },
    {
        name: 'Dashy',
        slug: 'dashy',
        icon: '/docs/images/services/dashy-logo.png',
        description: 'Customizable homepage dashboard for self-hosted services.',
        category: 'Administration'
    },
    {
        name: 'Deno KV',
        slug: 'denokv',
        icon: '/docs/images/services/denolookingup-logo.svg',
        description: 'Deno\'s built-in key-value database service.',
        category: 'Development'
    },
    {
        name: 'Directus',
        slug: 'directus',
        icon: '/docs/images/services/directus-logo.svg',
        description: 'An open-source headless CMS and API for custom databases.',
        category: 'CMS'
    },
    {
        name: 'Docker Registry',
        slug: 'docker-registry',
        icon: '/docs/images/services/docker-registry-logo.png',
        description: 'A Docker registry to store and manage your Docker images.',
        category: 'Development'
    },
    {
        name: 'Docmost',
        slug: 'docmost',
        icon: '/docs/images/services/docmost-logo.png',
        description: 'Open-source document collaboration platform.',
        category: 'Documentation'
    },
    {
        name: 'Documenso',
        slug: 'documenso',
        icon: '/docs/images/services/documenso-logo.png',
        description: 'Open-source DocuSign alternative for document signing.',
        category: 'Business'
    },
    {
        name: 'Docuseal',
        slug: 'docuseal',
        icon: '/docs/images/services/docuseal-logo.png',
        description: 'Open source DocuSign alternative.',
        category: 'Business'
    },
    {
        name: 'DokuWiki',
        slug: 'dokuwiki',
        icon: '/docs/images/services/dokuwiki-logo.png',
        description: 'A simple to use and highly versatile Open Source wiki software that doesn\'t require a database.',
        category: 'Documentation'
    },
    {
        name: 'Dolibarr',
        slug: 'dolibarr',
        icon: '/docs/images/services/dolibarr-logo.png',
        description: 'Open-source ERP and CRM software.',
        category: 'Business'
    },
    {
        name: 'Dozzle',
        slug: 'dozzle',
        icon: '/docs/images/services/dozzle-logo.svg',
        description: 'Realtime log viewer for docker containers.',
        category: 'Development'
    },
    {
        name: 'Drupal',
        slug: 'drupal',
        icon: '/docs/images/services/drupal-logo.svg',
        description: 'Open-source content management system.',
        category: 'CMS'
    },
    {
        name: 'Duplicati',
        slug: 'duplicati',
        icon: '/docs/images/services/duplicati-logo.webp',
        description: 'A free backup client that securely stores encrypted, incremental, compressed backups on cloud storage services and remote file servers.',
        category: 'Backup'
    },
    {
        name: 'Easy Appointments',
        slug: 'easyappointments',
        icon: '/docs/images/services/easyappointments-logo.png',
        description: 'Open-source appointment scheduler.',
        category: 'Business'
    },
    {
        name: 'Emby',
        slug: 'emby',
        icon: '/docs/images/services/emby-logo.png',
        description: 'A media server to organize, play, and stream audio and video to a variety of devices.',
        category: 'Media'
    },
    {
        name: 'Elasticsearch',
        slug: 'elasticsearch',
        icon: '/docs/images/services/elasticsearch-logo.svg',
        description: 'Free and Open Source, Distributed, RESTful Search Engine.',
        category: 'Search'
    },
    {
        name: 'Emby Stat',
        slug: 'emby-stat',
        icon: '/docs/images/services/embystat-logo.svg',
        description: 'A simple and easy-to-use Emby statistics dashboard.',
        category: 'Media'
    },
    {
        name: 'Ente',
        slug: 'ente',
        icon: '/docs/images/services/ente-logo.webp',
        description: 'A fully open-source, end-to-end encrypted platform for you to store data in the cloud without needing to trust the service provider.',
        category: 'Productivity'
    },
    {
        name: 'Excalidraw',
        slug: 'excalidraw',
        icon: '/docs/images/services/excalidraw-logo.svg',
        description: 'Virtual whiteboard for sketching hand-drawn like diagrams.',
        category: 'Productivity'
    },
    {
        name: 'Evolution API',
        slug: 'evolution-api',
        icon: '/docs/images/services/evolution-api-logo.svg',
        description: 'WhatsApp API service for automation.',
        category: 'Automation'
    },
    {
        name: 'Faraday',
        slug: 'faraday',
        icon: '/docs/images/services/faraday-logo.png',
        description: 'Collaborative penetration testing and vulnerability management platform.',
        category: 'Security'
    },
    {
        name: 'Fider',
        slug: 'fider',
        icon: '/docs/images/services/fider-logo.svg',
        description: 'An open platform to collect and organize customer feedback.',
        category: 'Business'
    },
    {
        name: 'Filebrowser',
        slug: 'filebrowser',
        icon: '/docs/images/services/filebrowser-logo.svg',
        description: 'A file manager for the web.',
        category: 'File Management'
    },
    {
        name: 'FileFlows',
        slug: 'fileflows',
        icon: '/docs/images/services/fileflows-logo.svg',
        description: 'A automatic file processing service.',
        category: 'File Management'
    },
    {
        name: 'Firefly III',
        slug: 'firefly-iii',
        icon: '/docs/images/services/firefly-iii-logo.svg',
        description: 'A personal finances manager.',
        category: 'Finance'
    },
    {
        name: 'Firefox',
        slug: 'firefox',
        icon: '/docs/images/services/firefox-logo.png',
        description: 'Firefox browser in a container.',
        category: 'Browser'
    },
    {
        name: 'Flipt',
        slug: 'flipt',
        icon: '/docs/images/services/flipt-logo.svg',
        description: 'Open-source feature flag management platform.',
        category: 'Development'
    },
    {
        name: 'Flowise',
        slug: 'flowise',
        icon: '/docs/images/services/flowise-logo.svg',
        description: 'Drag & drop UI to build your customized LLM flow.',
        category: 'AI'
    },
    {
        name: 'Forgejo',
        slug: 'forgejo',
        icon: '/docs/images/services/forgejo-logo.svg',
        description: 'A self-hosted Git service fork of Gitea.',
        category: 'Development'
    },
    {
        name: 'Formbricks',
        slug: 'formbricks',
        icon: '/docs/images/services/formbricks-logo.png',
        description: 'A form builder for static sites.',
        category: 'Development'
    },
    {
        name: 'FoundryVTT',
        slug: 'foundryvtt',
        icon: '/docs/images/services/foundryvtt-logo.png',
        description: 'Virtual tabletop for tabletop role-playing games.',
        category: 'Gaming'
    },
    {
        name: 'FreeScout',
        slug: 'freescout',
        icon: '/docs/images/services/freescout-logo.png',
        description: 'Help desk and customer support application.',
        category: 'Business'
    },
    {
        name: 'FreshRSS',
        slug: 'freshrss',
        icon: '/docs/images/services/freshrss-logo.png',
        description: 'Free, self-hostable RSS feed aggregator.',
        category: 'RSS'
    },
    {
        name: 'Ghost',
        slug: 'ghost',
        icon: '/docs/images/services/ghost-logo.svg',
        description: 'A professional publishing platform.',
        category: 'CMS'
    },
    {
        name: 'Gitea',
        slug: 'gitea',
        icon: '/docs/images/services/gitea-logo.svg',
        description: 'A painless self-hosted Git service.',
        category: 'Development'
    },
    {
        name: 'GitHub Runner',
        slug: 'github-runner',
        icon: '/docs/images/services/githubrunner-logo.png',
        description: 'A GitHub Actions runner for Docker.',
        category: 'Development'
    },
    {
        name: 'GitLab',
        slug: 'gitlab',
        icon: '/docs/images/services/gitlab-logo.svg',
        description: 'DevOps lifecycle tool.',
        category: 'Development'
    },
    {
        name: 'Gotify',
        slug: 'gotify',
        icon: '/docs/images/services/gotify-logo.svg',
        description: 'Open-source push notifications for web and mobile apps.',
        category: 'Notifications'
    },
    {
        name: 'GoWa',
        slug: 'gowa',
        icon: '/docs/images/services/gowa-logo.svg',
        description: 'Golang WhatsApp - Built with Go for efficient memory use.',
        category: 'Communication'
    },
    {
        name: 'Glance',
        slug: 'glance',
        icon: '/docs/images/services/glance-logo.png',
        description: 'All-in-one Home Server Dashboard.',
        category: 'Administration'
    },
    {
        name: 'Glances',
        slug: 'glances',
        icon: '/docs/images/services/glances-logo.png',
        description: 'Cross-platform system monitoring tool.',
        category: 'Monitoring'
    },
    {
        name: 'GlitchTip',
        slug: 'glitchtip',
        icon: '/docs/images/services/glitchtip-logo.png',
        description: 'An open-source error tracking tool.',
        category: 'Development'
    },
    {
        name: 'Gotenberg',
        slug: 'gotenberg',
        icon: '/docs/images/services/gotenberg-logo.png',
        description: 'A Docker-powered stateless API for PDF files.',
        category: 'Development'
    },
    {
        name: 'Grafana',
        slug: 'grafana',
        icon: '/docs/images/services/grafana-logo.svg',
        description: 'The open platform for beautiful analytics and monitoring.',
        category: 'Monitoring'
    },
    {
        name: 'Gramps Web',
        slug: 'gramps-web',
        icon: '/docs/images/services/grampsweb-logo.svg',
        description: 'The free, open-source genealogy system.',
        category: 'Family'
    },
    {
        name: 'Grocy',
        slug: 'grocy',
        icon: '/docs/images/services/grocy-logo.svg',
        description: 'A self-hosted groceries & household management solution for your home.',
        category: 'Home'
    },
    {
        name: 'Heimdall',
        slug: 'heimdall',
        icon: '/docs/images/services/heimdall-logo.svg',
        description: 'An elegant solution to organize all your web applications.',
        category: 'Administration'
    },
    {
        name: 'HeyForm',
        slug: 'heyform',
        icon: '/docs/images/services/heyform-logo.svg',
        description: 'Open-source form builder for conversational forms.',
        category: 'Development'
    },
    {
        name: 'Hoarder',
        slug: 'hoarder',
        icon: '/docs/images/services/hoarder-logo.png',
        description: 'Self-hosted bookmark manager with AI-powered tagging.',
        category: 'Bookmarks'
    },
    {
        name: 'Homarr',
        slug: 'homarr',
        icon: '/docs/images/services/homarr-logo.svg',
        description: 'Customizable browser homepage and dashboard.',
        category: 'Administration'
    },
    {
        name: 'Homebox',
        slug: 'homebox',
        icon: '/docs/images/services/homebox-logo.svg',
        description: 'Inventory and organization system built for the Home User.',
        category: 'Home'
    },
    {
        name: 'Home Assistant',
        slug: 'home-assistant',
        icon: '/docs/images/services/homeassistant-logo.svg',
        description: 'Open-source home automation platform focused on local control and privacy.',
        category: 'Home'
    },
    {
        name: 'Homepage',
        slug: 'homepage',
        icon: '/docs/images/services/homepage-logo.png',
        description: 'A modern homepage for your server.',
        category: 'Administration'
    },
    {
        name: 'Hoppscotch',
        slug: 'hoppscotch',
        icon: '/docs/images/services/hoppscotch-logo.png',
        description: 'Open-source API development ecosystem.',
        category: 'Development'
    },
    {
        name: 'Immich',
        slug: 'immich',
        icon: '/docs/images/services/immich-logo.svg',
        description: 'Self-hosted photo and video backup solution.',
        category: 'Media'
    },
    {
        name: 'Infisical',
        slug: 'infisical',
        icon: '/docs/images/services/infisical-logo.svg',
        description: 'Open source secret management platform.',
        category: 'Security'
    },
    {
        name: 'Invoice Ninja',
        slug: 'invoice-ninja',
        icon: '/docs/images/services/invoiceninja-logo.png',
        description: 'Invoice management system.',
        category: 'Business'
    },
    {
        name: 'IT Tools',
        slug: 'it-tools',
        icon: '/docs/images/services/ittools-logo.svg',
        description: 'Collection of handy online tools for developers.',
        category: 'Development'
    },
    {
        name: 'Jellyfin',
        slug: 'jellyfin',
        icon: '/docs/images/services/jellyfin-logo.svg',
        description: 'The Free Software Media System.',
        category: 'Media'
    },
    {
        name: 'Jenkins',
        slug: 'jenkins',
        icon: '/docs/images/services/jenkins-logo.svg',
        description: 'Open-source automation server.',
        category: 'Development'
    },
    {
        name: 'Joomla',
        slug: 'joomla',
        icon: '/docs/images/services/joomla-logo.svg',
        description: 'Open-source content management system.',
        category: 'CMS'
    },
    {
        name: 'Joplin',
        slug: 'joplin',
        icon: '/docs/images/services/joplin-logo.png',
        description: 'Open-source note taking and to-do application.',
        category: 'Productivity'
    },
    {
        name: 'Jupyter Notebook',
        slug: 'jupyter-notebook-python',
        icon: '/docs/images/services/jupyternotebook-logo.svg',
        description: 'Interactive computing environment for Python.',
        category: 'Development'
    },
    {
        name: 'KaraKeep',
        slug: 'karakeep',
        icon: '/docs/images/services/karakeep-logo.svg',
        description: 'Self-hostable bookmark-everything app with AI-based automatic tagging.',
        category: 'Productivity'
    },
    {
        name: 'Keycloak',
        slug: 'keycloak',
        icon: '/docs/images/services/keycloak-logo.svg',
        description: 'Open-source identity and access management solution.',
        category: 'Security'
    },
    {
        name: 'Kimai',
        slug: 'kimai',
        icon: '/docs/images/services/kimai-logo.svg',
        description: 'An open-source time-tracking solution for teams of all sizes.',
        category: 'Business'
    },
    {
        name: 'Kuzzle',
        slug: 'kuzzle',
        icon: '/docs/images/services/kuzzle-logo.png',
        description: 'A powerful backend that enables you to build modern apps faster.',
        category: 'Development'
    },
    {
        name: 'Label Studio',
        slug: 'labelstudio',
        icon: '/docs/images/services/labelstudio-logo.png',
        description: 'Open source data labeling platform.',
        category: 'AI'
    },
    {
        name: 'Langfuse',
        slug: 'langfuse',
        icon: '/docs/images/services/langfuse-logo.svg',
        description: 'Open source LLM engineering platform.',
        category: 'AI'
    },
    {
        name: 'LibreOffice',
        slug: 'libreoffice',
        icon: '/docs/images/services/libreoffice-logo.svg',
        description: 'Free and open-source office suite.',
        category: 'Productivity'
    },
    {
        name: 'LibreChat',
        slug: 'librechat',
        icon: '/docs/images/services/librechat-logo.svg',
        description: 'Self-hosted, powerful, and privacy-focused chat UI for multiple AI models.',
        category: 'AI'
    },
    {
        name: 'LobeChat',
        slug: 'lobe-chat',
        icon: '/docs/images/services/lobechat-logo.webp',
        description: 'Open-source, modern AI chat framework with multi-provider support and knowledge base management.',
        category: 'AI'
    },
    {
        name: 'LibreTranslate',
        slug: 'libretranslate',
        icon: '/docs/images/services/libretranslate-logo.svg',
        description: 'Free and open-source machine translation API.',
        category: 'AI'
    },
    {
        name: 'Listmonk',
        slug: 'listmonk',
        icon: '/docs/images/services/listmonk-logo.svg',
        description: 'Self-hosted newsletter and mailing list manager.',
        category: 'Marketing'
    },
    {
        name: 'LiteLLM',
        slug: 'litellm',
        icon: '/docs/images/services/litellm-logo.svg',
        description: 'Open source LLM Gateway to manage authentication, loadbalancing, and spend tracking across 100+ LLMs. All in the OpenAI format.',
        category: 'AI'
    },
    {
        name: 'LiteQueen',
        slug: 'litequeen',
        icon: '/docs/images/services/litequeen-logo.svg',
        description: 'Lightweight service management platform.',
        category: 'Administration'
    },
    {
        name: 'Logto',
        slug: 'logto',
        icon: '/docs/images/services/logto-logo.svg',
        description: 'Logto is an Auth0 alternative designed for modern apps and SaaS products.',
        category: 'Security'
    },
    {
        name: 'Lowcoder',
        slug: 'lowcoder',
        icon: '/docs/images/services/lowcoder-logo.svg',
        description: 'Open-source low-code platform for building internal tools.',
        category: 'Development'
    },
    {
        name: 'Mailpit',
        slug: 'mailpit',
        icon: '/docs/images/services/mailpit-logo.svg',
        description: 'Self-hosted email and SMTP testing tool.',
        category: 'Development'
    },
    {
        name: 'Martin',
        slug: 'martin',
        icon: '/docs/images/services/martin-logo.png',
        description: 'PostGIS vector tile server.',
        category: 'Development'
    },
    {
        name: 'Matrix',
        slug: 'matrix',
        icon: '/docs/images/services/matrix-logo.svg',
        description: 'Chat securely with your family, friends, community.',
        category: 'Communication'
    },
    {
        name: 'Mattermost',
        slug: 'mattermost',
        icon: '/docs/images/services/mattermost-logo.svg',
        description: 'Open-source messaging platform for teams.',
        category: 'Communication'
    },
    {
        name: 'Mautic',
        slug: 'mautic',
        icon: '/docs/images/services/mautic-logo.svg',
        description: 'Open-source marketing automation platform.',
        category: 'Marketing'
    },
    {
        name: 'Maybe',
        slug: 'maybe',
        icon: '/docs/images/services/maybe-logo.svg',
        description: 'Personal finance and wealth management application.',
        category: 'Finance'
    },
    {
        name: 'Mealie',
        slug: 'mealie',
        icon: '/docs/images/services/mealie-logo.png',
        description: 'Self-hosted recipe manager and meal planner.',
        category: 'Home'
    },
    {
        name: 'MediaWiki',
        slug: 'mediawiki',
        icon: '/docs/images/services/mediawiki-logo.svg',
        description: 'A free and open-source wiki software package.',
        category: 'Documentation'
    },
    {
        name: 'Meilisearch',
        slug: 'meilisearch',
        icon: '/docs/images/services/meilisearch-logo.svg',
        description: 'A powerful, fast, open-source, easy to use, and deploy search engine.',
        category: 'Search'
    },
    {
        name: 'Metabase',
        slug: 'metabase',
        icon: '/docs/images/services/metabase-logo.svg',
        description: 'The simplest, fastest way to share data and analytics inside your company.',
        category: 'Analytics'
    },
    {
        name: 'Metube',
        slug: 'metube',
        icon: '/docs/images/services/metube-logo.svg',
        description: 'A self-hosted video sharing platform.',
        category: 'Media'
    },
    {
        name: 'MindsDB',
        slug: 'mindsdb',
        icon: '/docs/images/services/mindsdb-logo.svg',
        description: 'Machine learning platform that brings AI to databases.',
        category: 'AI'
    },
    {
        name: 'Minecraft',
        slug: 'minecraft',
        icon: '/docs/images/services/minecraft-logo.svg',
        description: 'Minecraft game server.',
        category: 'Gaming'
    },
    {
        name: 'Miniflux',
        slug: 'miniflux',
        icon: '/docs/images/services/miniflux-logo.svg',
        description: 'Minimalist and opinionated feed reader.',
        category: 'RSS'
    },
    {
        name: 'MinIO',
        slug: 'minio',
        icon: '/docs/images/services/minio-logo.svg',
        description: 'A high-performance, distributed object storage system.',
        category: 'Storage'
    },
    {
        name: 'Mixpost',
        slug: 'mixpost',
        icon: '/docs/images/services/mixpost-logo.svg',
        description: 'Self-hosted social media management software (Buffer alternative).',
        category: 'Social Media'
    },
    {
        name: 'Moodle',
        slug: 'moodle',
        icon: '/docs/images/services/moodle-logo.png',
        description: 'Open-source learning platform.',
        category: 'Education'
    },
    {
        name: 'Mosquitto',
        slug: 'mosquitto',
        icon: '/docs/images/services/mosquitto-logo.svg',
        description: 'Open-source MQTT broker.',
        category: 'IoT'
    },
    {
        name: 'N8N',
        slug: 'n8n',
        icon: '/docs/images/services/n8n-logo.png',
        description: 'Workflow automation tool.',
        category: 'Automation'
    },
    {
        name: 'Neon WS Proxy',
        slug: 'neon-ws-proxy',
        icon: '/docs/images/services/neon-logo.svg',
        description: 'WebSocket proxy for Neon database.',
        category: 'Development'
    },
    {
        name: 'NewAPI',
        slug: 'newapi',
        icon: '/docs/images/services/newapi-logo.png',
        description: 'The next-generation LLM gateway and AI asset management system supports multiple languages.',
        category: 'AI'
    },
    {
        name: 'Next Image Transformation',
        slug: 'next-image-transformation',
        icon: '/docs/images/services/nextimage-logo.svg',
        description: 'Image transformation service for Next.js.',
        category: 'Development'
    },
    {
        name: 'Nextcloud',
        slug: 'nextcloud',
        icon: '/docs/images/services/nextcloud-logo.svg',
        description: 'A safe home for all your data.',
        category: 'Storage'
    },
    {
        name: 'Nexus',
        slug: 'nexus',
        icon: '/docs/images/services/nexus-logo.png',
        description: 'A repository manager that allows you to store, manage, and distribute your software artifacts.',
        category: 'Development'
    },
    {
        name: 'Nitropage',
        slug: 'nitropage',
        icon: '/docs/images/services/nitropage-logo.svg',
        description: 'Nitropage is an extensible, drag-and-drop website builder based on SolidStart, completely free and open source.',
        category: 'Development'
    },
    {
        name: 'NocoDB',
        slug: 'nocodb',
        icon: '/docs/images/services/nocodb-logo.svg',
        description: 'Open Source Airtable Alternative.',
        category: 'Database'
    },
    {
        name: 'NodeBB',
        slug: 'nodebb',
        icon: '/docs/images/services/nodebb-logo.svg',
        description: 'Node.js based forum software.',
        category: 'Forum'
    },
    {
        name: 'Ntfy',
        slug: 'ntfy',
        icon: '/docs/images/services/ntfy-logo.svg',
        description: 'Simple HTTP-based pub-sub notification service.',
        category: 'Notifications'
    },
    {
        name: 'Odoo',
        slug: 'odoo',
        icon: '/docs/images/services/odoo-logo.svg',
        description: 'Open source ERP and CRM.',
        category: 'Business'
    },
    {
        name: 'Ollama',
        slug: 'ollama',
        icon: '/docs/images/services/ollama-logo.svg',
        description: 'A lightweight and efficient server for running large language models (LLMs) on your local machine or in the cloud.',
        category: 'AI'
    },
    {
        name: 'Once Campfire',
        slug: 'once-campfire',
        icon: '/docs/images/services/oncecampfire-logo.png',
        description: 'Web-based chat application.',
        category: 'Communication'
    },
    {
        name: 'OneDev',
        slug: 'onedev',
        icon: '/docs/images/services/onedev-logo.svg',
        description: 'Self-hosted Git server with integrated CI/CD and kanban.',
        category: 'Development'
    },
    {
        name: 'Open WebUI',
        slug: 'open-webui',
        icon: '/docs/images/services/openwebui-logo.svg',
        description: 'User-friendly WebUI for LLMs, formerly Ollama WebUI.',
        category: 'AI'
    },
    {
        name: 'Openblocks',
        slug: 'openblocks',
        icon: '/docs/images/services/openblocks-logo.svg',
        description: 'Open-source low code platform.',
        category: 'Development'
    },
    {
        name: 'Organizr',
        slug: 'organizr',
        icon: '/docs/images/services/organizr-logo.png',
        description: 'Homepage organizer for your server services.',
        category: 'Administration'
    },
    {
        name: 'osTicket',
        slug: 'osticket',
        icon: '/docs/images/services/osticket-logo.png',
        description: 'Open-source help desk ticketing system.',
        category: 'Business'
    },
    {
        name: 'OpenPanel',
        slug: 'openpanel',
        icon: '/docs/images/services/openpanel-logo.svg',
        description: 'Open source alternative to Mixpanel and Plausible for product analytics.',
        category: 'Analytics'
    },
    {
        name: 'Outline',
        slug: 'outline',
        icon: '/docs/images/services/outline-logo.svg',
        description: 'Open-source collaboration tool.',
        category: 'Productivity'
    },
    {
        name: 'Overseerr',
        slug: 'overseerr',
        icon: '/docs/images/services/overseerr-logo.svg',
        description: 'A request management and media discovery tool built to work with your existing Plex ecosystem.',
        category: 'Media'
    },
    {
        name: 'ownCloud',
        slug: 'owncloud',
        icon: '/docs/images/services/owncloud-logo.svg',
        description: 'File synchronization and sharing platform.',
        category: 'Storage'
    },
    {
        name: 'Pairdrop',
        slug: 'pairdrop',
        icon: '/docs/images/services/pairdrop-logo.png',
        description: 'Local file sharing in your browser.',
        category: 'File Sharing'
    },
    {
        name: 'Paperless',
        slug: 'paperless',
        icon: '/docs/images/services/paperless-logo.png',
        description: 'Document management system that transforms physical documents into searchable online archives.',
        category: 'Documentation'
    },
    {
        name: 'Paymenter',
        slug: 'paymenter',
        icon: '/docs/images/services/paymenter-logo.svg',
        description: 'Open-Source Billing, Built for Hosting Providers.',
        category: 'Business'
    },
    {
        name: 'Penpot',
        slug: 'penpot',
        icon: '/docs/images/services/penpot-logo.svg',
        description: 'Open Source design & prototyping platform.',
        category: 'Design'
    },
    {
        name: 'Pi-hole',
        slug: 'pi-hole',
        icon: '/docs/images/services/pihole-logo.svg',
        description: 'Network-wide ad blocker that acts as a DNS sinkhole.',
        category: 'Security'
    },
    {
        name: 'Pocket ID',
        slug: 'pocket-id',
        icon: '/docs/images/services/pocketid-logo.webp',
        description: 'A simple OIDC provider for passwordless authentication with passkeys.',
        category: 'Security'
    },
    {
        name: 'phpMyAdmin',
        slug: 'phpmyadmin',
        icon: '/docs/images/services/phpmyadmin-logo.svg',
        description: 'MySQL database management tool.',
        category: 'Development'
    },
    {
        name: 'PingvinShare',
        slug: 'pingvinshare',
        icon: '/docs/images/services/pingvinshare-logo.svg',
        description: 'Self-hosted file sharing platform that combines lightness and beauty.',
        category: 'File Sharing'
    },
    {
        name: 'Plane',
        slug: 'plane',
        icon: '/docs/images/services/plane-logo.svg',
        description: 'Open source project planning tool.',
        category: 'Project Management'
    },
    {
        name: 'Plex',
        slug: 'plex',
        icon: '/docs/images/services/plex-logo.svg',
        description: 'Media server software.',
        category: 'Media'
    },
    {
        name: 'Plunk',
        slug: 'plunk',
        icon: '/docs/images/services/plunk-logo.svg',
        description: 'Self-hosted email marketing platform.',
        category: 'Marketing'
    },
    {
        name: 'Pocketbase',
        slug: 'pocketbase',
        icon: '/docs/images/services/pocketbase-logo.svg',
        description: 'Open Source backend for your next SaaS and Mobile app.',
        category: 'Development'
    },
    {
        name: 'Portainer',
        slug: 'portainer',
        icon: '/docs/images/services/portainer-logo.png',
        description: 'Container management platform.',
        category: 'Development'
    },
    {
        name: 'PostHog',
        slug: 'posthog',
        icon: '/docs/images/services/posthog-logo.svg',
        description: 'Open source product analytics.',
        category: 'Analytics',
        ignore: true
    },
    {
        name: 'Postiz',
        slug: 'postiz',
        icon: '/docs/images/services/postiz-logo.png',
        description: 'Social media scheduling and analytics tool.',
        category: 'Social Media'
    },
    {
        name: 'Pterodactyl',
        slug: 'pterodactyl',
        icon: '/docs/images/services/pterodactyl_logo_transparent.png',
        description: 'Game server management panel with Wings daemon for hosting Minecraft, CS:GO, ARK and more.',
        category: 'Gaming'
    },
    {
        name: 'Prefect',
        slug: 'prefect',
        icon: '/docs/images/services/prefect-logo.png',
        description: 'Open source workflow management platform.',
        category: 'Development'
    },
    {
        name: 'PrivateBin',
        slug: 'privatebin',
        icon: '/docs/images/services/privatebin-logo.svg',
        description: 'Minimalist, open-source online pastebin.',
        category: 'Development'
    },
    {
        name: 'Prowlarr',
        slug: 'prowlarr',
        icon: '/docs/images/services/prowlarr-logo.svg',
        description: 'A free and open source BitTorrent client.',
        category: 'Media'
    },
    {
        name: 'Proxyscotch',
        slug: 'proxyscotch',
        icon: '/docs/images/services/proxyscotch.png',
        description: 'Tiny open-source CORS proxy made by Hoppscotch.',
        category: 'Development'
    },
    {
        name: 'qBittorrent',
        slug: 'qbittorrent',
        icon: '/docs/images/services/qbittorrent-logo.svg',
        description: 'Free and open-source BitTorrent client.',
        category: 'Media'
    },
    {
        name: 'Qdrant',
        slug: 'qdrant',
        icon: '/docs/images/services/qdrant-logo.svg',
        description: 'Open source, AI-native vector database.',
        category: 'AI'
    },
    {
        name: 'RabbitMQ',
        slug: 'rabbitmq',
        icon: '/docs/images/services/rabbitmq-logo.svg',
        description: 'Open source message broker.',
        category: 'Development'
    },
    {
        name: 'Radarr',
        slug: 'radarr',
        icon: '/docs/images/services/radarr-logo.svg',
        description: 'A Media server software.',
        category: 'Media'
    },
    {
        name: 'Rallly',
        slug: 'rallly',
        icon: '/docs/images/services/rallly-logo.svg',
        description: 'Open-source meeting scheduling tool.',
        category: 'Productivity'
    },
    {
        name: 'Reactive Resume',
        slug: 'reactive-resume',
        icon: '/docs/images/services/rxresume-logo.svg',
        description: 'A free and open source resume builder.',
        category: 'Productivity'
    },
    {
        name: 'Readeck',
        slug: 'readeck',
        icon: '/docs/images/services/readeck-logo.svg',
        description: 'Web article reader and bookmark manager.',
        category: 'Productivity'
    },
    {
        name: 'Redlib',
        slug: 'redlib',
        icon: '/docs/images/services/redlib-logo.svg',
        description: 'Private front-end for Reddit.',
        category: 'Social Media'
    },
    {
        name: 'Rivet Engine',
        slug: 'rivet-engine',
        icon: '/docs/images/services/rivet-logo.svg',
        description: 'Backend engine for running stateful actors at scale with automatic scaling and distributed state management.',
        category: 'Development'
    },
    {
        name: 'Rocket.Chat',
        slug: 'rocketchat',
        icon: '/docs/images/services/rocketchat-logo.svg',
        description: 'Open source team chat software.',
        category: 'Communication'
    },
    {
        name: 'SearXNG',
        slug: 'searxng',
        icon: '/docs/images/services/searxng-logo.svg',
        description: 'Open source search engine.',
        category: 'Search'
    },
    {
        name: 'Sequin',
        slug: 'sequin',
        icon: '/docs/images/services/sequin-logo.svg',
        description: 'The fastest Postgres change data capture.',
        category: 'Analytics'
    },
    {
        name: 'Shlink',
        slug: 'shlink',
        icon: '/docs/images/services/shlink-logo.svg',
        description: 'The open source URL shortener.',
        category: 'Development'
    },
    {
        name: 'Slash',
        slug: 'slash',
        icon: '/docs/images/services/slash-logo.svg',
        description: 'Open-source, self-hosted links and notes manager.',
        category: 'Productivity'
    },
    {
        name: 'Snapdrop',
        slug: 'snapdrop',
        icon: '/docs/images/services/snapdrop-logo.svg',
        description: 'Local file sharing in your browser.',
        category: 'File Sharing'
    },
    {
        name: 'Soketi',
        slug: 'soketi',
        icon: '/docs/images/services/soketi-logo.jpeg',
        description: 'Open-source WebSocket server.',
        category: 'Development'
    },
    {
        name: 'Sonarr',
        slug: 'sonarr',
        icon: '/docs/images/services/sonarr-logo.svg',
        description: 'A internet PVR for Usenet and Torrents.',
        category: 'Media'
    },
    {
        name: 'SparkyFitness',
        slug: 'sparkyfitness',
        icon: '/docs/images/services/sparkyfitness.webp',
        description: 'A comprehensive fitness app that helps users track nutrition, exercise, and body metrics.',
        category: 'Health'
    },
    {
        name: 'Statusnook',
        slug: 'statusnook',
        icon: '/docs/images/services/statusnook-logo.svg',
        description: 'A status page system for your website.',
        category: 'Monitoring'
    },
    {
        name: 'Stirling PDF',
        slug: 'stirling-pdf',
        icon: '/docs/images/services/stirling-pdf-logo.png',
        description: 'Powerful PDF manipulation tool.',
        category: 'Documentation'
    },
    {
        name: 'Strapi',
        slug: 'strapi',
        icon: '/docs/images/services/strapi-logo.svg',
        description: 'Open-source headless CMS.',
        category: 'CMS'
    },
    {
        name: 'Supabase',
        slug: 'supabase',
        icon: '/docs/images/services/supabase-logo.svg',
        description: 'Open source Firebase alternative.',
        category: 'Development'
    },
    {
        name: 'Superset',
        slug: 'superset',
        icon: '/docs/images/services/superset-logo.svg',
        description: 'Open-source data visualization and exploration platform.',
        category: 'Analytics'
    },
    {
        name: 'SuperTokens',
        slug: 'supertokens',
        icon: '/docs/images/services/supertokens-logo.svg',
        description: 'Open-source authentication solution.',
        category: 'Security'
    },
    {
        name: 'Swetrix',
        slug: 'swetrix',
        icon: '/docs/images/services/swetrix.svg',
        description: 'Privacy-friendly and cookieless European web analytics alternative to Google Analytics.',
        category: 'Analytics'
    },
    {
        name: 'Syncthing',
        slug: 'syncthing',
        icon: '/docs/images/services/syncthing-logo.svg',
        description: 'Open Source Continuous File Synchronization.',
        category: 'File Management'
    },
    {
        name: 'Teable',
        slug: 'teable',
        icon: '/docs/images/services/teable-logo.png',
        description: 'No-code database built on PostgreSQL.',
        category: 'Database'
    },
    {
        name: 'Tolgee',
        slug: 'tolgee',
        icon: '/docs/images/services/tolgee-logo.svg',
        description: 'Open source localization platform.',
        category: 'Development'
    },
    {
        name: 'Traccar',
        slug: 'traccar',
        icon: '/docs/images/services/traccar-logo.png',
        description: 'Open-source GPS tracking platform.',
        category: 'IoT'
    },
    {
        name: 'Transmission',
        slug: 'transmission',
        icon: '/docs/images/services/transmission-logo.svg',
        description: 'Fast, easy, and free BitTorrent client.',
        category: 'Media'
    },
    {
        name: 'TriliumNext',
        slug: 'triliumnext',
        icon: '/docs/images/services/triliumnext-logo.svg',
        description: 'Build your personal knowledge base with TriliumNext Notes.',
        category: 'Productivity'
    },
    {
        name: 'Trigger',
        slug: 'trigger',
        icon: '/docs/images/services/trigger-logo.png',
        description: 'Open-source workflow automation tool.',
        category: 'Automation'
    },
    {
        name: 'Unleash',
        slug: 'unleash',
        icon: '/docs/images/services/unleash-logo.svg',
        description: 'Open-source feature management platform.',
        category: 'Development'
    },
    {
        name: 'Unsend',
        slug: 'unsend',
        icon: '/docs/images/services/unsend-logo.svg',
        description: 'Open-source email recall service.',
        category: 'Email'
    },
    {
        name: 'Unstructured',
        slug: 'unstructured',
        icon: '/docs/images/services/unstructured-logo.png',
        description: 'Open-source platform and tools to ingest and process unstructured documents for Retrieval Augmented Generation (RAG) and model fine-tuning.',
        category: 'AI'
    },
    {
        name: 'Uptime Kuma',
        slug: 'uptime-kuma',
        icon: '/docs/images/services/uptime-kuma-logo.svg',
        description: 'A fancy self-hosted monitoring tool.',
        category: 'Monitoring'
    },
    {
        name: 'Vaultwarden',
        slug: 'vaultwarden',
        icon: '/docs/images/services/vaultwarden-logo.svg',
        description: 'Unofficial Bitwarden compatible server.',
        category: 'Security'
    },
    {
        name: 'Vikunja',
        slug: 'vikunja',
        icon: '/docs/images/services/vikunja-logo.svg',
        description: 'The open-source to-do app.',
        category: 'Productivity'
    },
    {
        name: 'VvvebJs',
        slug: 'vvveb',
        icon: '/docs/images/services/vvveb-logo.png',
        description: 'Powerful website builder with drag and drop functionality.',
        category: 'Development'
    },
    {
        name: 'Wakapi',
        slug: 'wakapi',
        icon: '/docs/images/services/wakapi-logo.svg',
        description: 'Open-source coding activity tracker.',
        category: 'Development'
    },
    {
        name: 'Weaviate',
        slug: 'weaviate',
        icon: '/docs/images/services/weaviate-logo.webp',
        description: 'Open source, AI-native vector database.',
        category: 'AI'
    },
    {
        name: 'Web Check',
        slug: 'web-check',
        icon: '/docs/images/services/webcheck-logo.png',
        description: 'All-in-one website analysis tool.',
        category: 'Development'
    },
    {
        name: 'Weblate',
        slug: 'weblate',
        icon: '/docs/images/services/weblate-logo.webp',
        description: 'Web-based translation tool.',
        category: 'Development'
    },
    {
        name: 'Whoogle',
        slug: 'whoogle',
        icon: '/docs/images/services/whoogle-logo.png',
        description: 'Self-hosted, ad-free, privacy-respecting metasearch engine.',
        category: 'Search'
    },
    {
        name: 'Wiki.js',
        slug: 'wikijs',
        icon: '/docs/images/services/wikijs-logo.svg',
        description: 'Modern and powerful wiki software built on Node.js.',
        category: 'Documentation'
    },
    {
        name: 'Windmill',
        slug: 'windmill',
        icon: '/docs/images/services/windmill-logo.svg',
        description: 'Open-source developer platform.',
        category: 'Development'
    },
    {
        name: 'WireGuard Easy',
        slug: 'wireguard-easy',
        icon: '/docs/images/services/wireguardeasy-logo.svg',
        description: 'Easy-to-use WireGuard VPN server.',
        category: 'Security'
    },
    {
        name: 'WordPress',
        slug: 'wordpress',
        icon: '/docs/images/services/wordpress-logo.svg',
        description: 'Website and blogging platform.',
        category: 'CMS'
    },
    {
        name: 'Zipline',
        slug: 'zipline',
        icon: '/docs/images/services/zipline-logo.svg',
        description: 'Next generation ShareX / File upload server',
        category: 'File Management'
    },
    {
        name: 'MetaMCP',
        slug: 'metamcp',
        icon: '/public/images/services/metamcp.png',
        description: 'MCP Aggregator, Orchestrator, Middleware, Gateway in one application.',
        category: 'AI'
    },
    {
        name: 'CodiMD',
        slug: 'codimd',
        icon: '/docs/images/services/codimd-logo.png',
        description: 'Realtime collaborative markdown notes on all platforms.',
        category: 'Productivity'
    },
    {
        name: 'Diun',
        slug: 'diun',
        icon: '/docs/images/services/diun-logo.svg',
        description: 'Docker Image Update Notifier.',
        category: 'Monitoring'
    },
    {
        name: 'Drizzle Gateway',
        slug: 'drizzle-gateway',
        icon: '/docs/images/services/drizzle-logo.jpeg',
        description: 'Drizzle Studio for exploring SQL databases.',
        category: 'Development'
    },
    {
        name: 'Grist',
        slug: 'grist',
        icon: '/docs/images/services/grist-logo.svg',
        description: 'Modern relational spreadsheet combining flexibility and database robustness.',
        category: 'Productivity'
    },
    {
        name: 'Leantime',
        slug: 'leantime',
        icon: '/docs/images/services/leantime-logo.svg',
        description: 'Lean project management system for innovators.',
        category: 'Project Management'
    },
    {
        name: 'LimeSurvey',
        slug: 'limesurvey',
        icon: '/docs/images/services/limesurvey-logo.svg',
        description: 'The most popular FOSS online survey tool on the web.',
        category: 'Business'
    },
    {
        name: 'Memos',
        slug: 'memos',
        icon: '/docs/images/services/memos-logo.png',
        description: 'Open-source, self-hosted memo hub with knowledge management.',
        category: 'Productivity'
    },
    {
        name: 'Navidrome',
        slug: 'navidrome',
        icon: '/docs/images/services/navidrome-logo.svg',
        description: 'Modern music server and streamer compatible with Subsonic/Airsonic.',
        category: 'Media'
    },
    {
        name: 'NetBird Client',
        slug: 'netbird-client',
        icon: '/docs/images/services/netbird-logo.png',
        description: 'Connect your devices into a secure WireGuard-based mesh network.',
        category: 'Networking'
    },
    {
        name: 'Observium',
        slug: 'observium',
        icon: '/docs/images/services/observium-logo.webp',
        description: 'Low-maintenance auto-discovering network monitoring platform.',
        category: 'Monitoring'
    },
    {
        name: 'OrangeHRM',
        slug: 'orangehrm',
        icon: '/docs/images/services/orangehrm-logo.svg',
        description: 'Free HR management system for businesses.',
        category: 'Business'
    },
    {
        name: 'Passbolt',
        slug: 'passbolt',
        icon: '/docs/images/services/passbolt-logo.svg',
        description: 'Open source password manager for teams.',
        category: 'Security'
    },
    {
        name: 'PGBackWeb',
        slug: 'pgbackweb',
        icon: '/docs/images/services/pgbackweb-logo.png',
        description: 'Effortless PostgreSQL backups with a user-friendly web interface.',
        category: 'Database'
    },
     {
        name: 'Postgresus',
        slug: 'postgresus',
        icon: '/docs/images/services/postgresus-logo.webp',
        description: 'A free, open source and self-hosted tool to backup PostgreSQL. Make backups with different storages and notifications about progress.',
        category: 'Backup'
    },
    {
        name: 'Ryot',
        slug: 'ryot',
        icon: '/docs/images/services/ryot-logo.svg',
        description: 'Self-hosted platform for tracking various facets of your life.',
        category: 'Productivity'
    },
    {
        name: 'Seafile',
        slug: 'seafile',
        icon: '/docs/images/services/seafile-logo.svg',
        description: 'High-performance file syncing and sharing with knowledge management features.',
        category: 'Storage'
    },
    {
        name: 'Typesense',
        slug: 'typesense',
        icon: '/docs/images/services/typesense-logo.png',
        description: 'Open source alternative to Algolia and easier-to-use alternative to ElasticSearch.',
        category: 'Search'
    },
    {
        name: 'Vert',
        slug: 'vert',
        icon: '/docs/images/services/vert-logo.png',
        description: 'Self-hosted file converter.',
        category: 'Utilities'
    },
    {
        name: 'Yamtrack',
        slug: 'yamtrack',
        icon: '/docs/images/services/yamtrack-logo.svg',
        description: 'Self-hosted music scrobble database.',
        category: 'Media'
    },
    {
        name: 'Marimo',
        slug: 'marimo',
        icon: '/docs/images/services/marimo.svg',
        description: 'Open-source reactive notebook for Python.',
        category: 'Development'
    }
]

const search = ref('')
const selectedCategories = ref(['All'])
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const categories = computed(() => {
    const uniqueCategories = new Set(services.map(s => s.category))
    return Array.from(uniqueCategories).sort()
})

// Add click outside handler
const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

// Add and remove event listeners
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    // Preload all service images to detect broken ones early
    preloadServices(services)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const filteredServicesByCategory = (category: string) => {
    return services.filter(s =>
        !s.ignore &&
        s.category === category &&
        (search.value === '' || s.name.toLowerCase().includes(search.value.toLowerCase()) || s.description.toLowerCase().includes(search.value.toLowerCase()))
    )
}

const filteredCategories = computed(() => {
    if (selectedCategories.value.includes('All')) {
        return categories.value.filter(category =>
            filteredServicesByCategory(category).length > 0
        )
    } else {
        return selectedCategories.value.filter(category =>
            filteredServicesByCategory(category).length > 0
        )
    }
})

const toggleCategory = (category: string) => {
    if (category === 'All') {
        selectedCategories.value = ['All']
        return
    }

    // Remove 'All' if it's currently selected and we're selecting a specific category
    if (selectedCategories.value.includes('All')) {
        selectedCategories.value = selectedCategories.value.filter(c => c !== 'All')
    }

    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
        // Category not found, add it
        selectedCategories.value.push(category)
    } else {
        // Category found, remove it
        selectedCategories.value.splice(index, 1)
        // If no categories are selected, default to 'All'
        if (selectedCategories.value.length === 0) {
            selectedCategories.value = ['All']
        }
    }
}

// Enhanced image fallback composable with preloading
const useImageFallback = () => {
    const imageStates = ref(new Map<string, 'loading' | 'loaded' | 'error'>())
    const validatedUrls = ref(new Set<string>())

    const preloadImage = (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            if (validatedUrls.value.has(url)) {
                resolve(!imageStates.value.get(url) || imageStates.value.get(url) === 'loaded')
                return
            }

            imageStates.value.set(url, 'loading')
            const img = new Image()

            const timeout = setTimeout(() => {
                imageStates.value.set(url, 'error')
                validatedUrls.value.add(url)
                resolve(false)
            }, 3000) // 3 second timeout

            img.onload = () => {
                clearTimeout(timeout)
                imageStates.value.set(url, 'loaded')
                validatedUrls.value.add(url)
                resolve(true)
            }

            img.onerror = () => {
                clearTimeout(timeout)
                imageStates.value.set(url, 'error')
                validatedUrls.value.add(url)
                resolve(false)
            }

            img.src = url
        })
    }

    const preloadServices = async (services: any[]) => {
        const imageUrls = services.map(service => service.icon)
        const promises = imageUrls.map(url => preloadImage(url))
        await Promise.allSettled(promises)
    }

    const handleImageError = (serviceName: string, url: string) => {
        imageStates.value.set(url, 'error')
        validatedUrls.value.add(url)
    }

    const hasImageError = (url: string) => {
        return imageStates.value.get(url) === 'error'
    }

    const isImageLoading = (url: string) => {
        return imageStates.value.get(url) === 'loading'
    }

    const getFallbackImage = () => {
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAwIiB6b29tQW5kUGFuPSJtYWduaWZ5IiB2aWV3Qm94PSIwIDAgMzc1IDM3NC45OTk5OTEiIGhlaWdodD0iNTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWVNpZCBtZWV0IiB2ZXJzaW9uPSIxLjAiPjxkZWZzPjxnLz48L2RlZnM+PGcgZmlsbD0iIzhjNTJmZiIgZmlsbC1vcGFjaXR5PSIwLjMwMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODQuNjYzNzkzLCAzMTAuMDE2NDg0KSI+PGc+PHBhdGggZD0iTSA2MyAtMTY4IEwgMjEgLTE2OCBMIDIxIC00MiBMIDYzIC00MiBaIE0gNjMgMCBMIDIzMSAwIEwgMjMxIC00MiBMIDYzIC00MiBaIE0gNjMgLTE2OCBMIDIzMSAtMTY4IEwgMjMxIC0yMTAgTCA2MyAtMjEwIFogTSA2MyAtMTY4ICIvPjwvZz48L2c+PC9nPjxnIGZpbGw9IiM4YzUyZmYiIGZpbGwtb3BhY2l0eT0iMC41MDIiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcxLjQwNTUzNywgMjk2Ljc1ODIzMykiPjxnPjxwYXRoIGQ9Ik0gNjMgLTE2OCBMIDIxIC0xNjggTCAyMSAtNDIgTCA2MyAtNDIgWiBNIDYzIDAgTCAyMzEgMCBMIDIzMSAtNDIgTCA2MyAtNDIgWiBNIDYzIC0xNjggTCAyMzEgLTE2OCBMIDIzMSAtMjEwIEwgNjMgLTIxMCBaIE0gNjMgLTE2OCAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjOGM1MmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU4LjE0NzI4NywgMjgzLjQ5OTk4MSkiPjxnPjxwYXRoIGQ9Ik0gNjMgLTE2OCBMIDIxIC0xNjggTCAyMSAtNDIgTCA2MyAtNDIgWiBNIDYzIDAgTCAyMzEgMCBMIDIzMSAtNDIgTCA2MyAtNDIgWiBNIDYzIC0xNjggTCAyMzEgLTE2OCBMIDIzMSAtMjEwIEwgNjMgLTIxMCBaIE0gNjMgLTE2OCAiLz48L2c+PC9nPjwvZz48L3N2Zz4="
    }

    const getLoadingSpinner = () => {
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIHN0cm9rZT0iIzhjNTJmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Im0zNSwyMGEyMCwyMCAwIDAgMSAtMTUsMTUiIHN0cm9rZT0iIzhjNTJmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIwIDIwIDIwOzM2MCAyMCAyMCIvPgo8L3BhdGg+Cjwvc3ZnPgo="
    }

    return {
        imageStates,
        preloadServices,
        handleImageError,
        hasImageError,
        isImageLoading,
        getFallbackImage,
        getLoadingSpinner
    }
}

const { preloadServices, handleImageError, hasImageError, isImageLoading, getFallbackImage, getLoadingSpinner } = useImageFallback()
</script>


<template>
    <div class="flex flex-col">
        <div class="input-container w-full flex flex-col justify-between gap-2">
            <input v-model="search" type="text" placeholder="Search"
                class="search w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg py-3 sm:py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
                style="background-color: rgba(101, 117, 133, 0.16);" />
            <div class="button-group relative flex flex-col gap-2" ref="dropdownRef">
                <button @click.stop="isOpen = !isOpen"
                    class="select flex items-center justify-between w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 sm:px-3 sm:py-2 bg-purple-700 dark:bg-purple-600 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
                    style="background-color: rgba(101, 117, 133, 0.16);">
                    <span class="text-sm sm:text-base">{{ selectedCategories.length === 1 ? selectedCategories[0] :
                        `${selectedCategories.length} categories` }}</span>
                    <svg class="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div v-if="isOpen"
                    class="dropdown-content absolute z-10 top-full left-0 right-0 rounded-lg shadow-lg bg-white dark:!bg-[#23272f] border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <div class="p-2">
                        <label
                            class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <input type="checkbox" :checked="selectedCategories.includes('All')"
                                @change="toggleCategory('All')"
                                class="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-800">
                            <span class="text-gray-900 dark:text-white">All Categories</span>
                        </label>
                        <div v-for="category in categories" :key="category" class="mt-1">
                            <label
                                class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                <input type="checkbox" :checked="selectedCategories.includes(category)"
                                    @change="toggleCategory(category)"
                                    class="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-800">
                                <span class="text-gray-900 dark:text-white">{{ category }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <a href='https://github.com/coollabsio/coolify/blob/v4.x/CONTRIBUTING.md'
                    class="text-gray-900 dark:text-white px-6 py-3 sm:px-4 sm:py-2 text-sm sm:text-base hover:dark:text-white w-auto hover:dark:border-purple-400 hover:dark:bg-purple-400/10">
                    Add Service
                </a>
            </div>
        </div>
        <div class="grid-container">
            <template v-if="selectedCategories.includes('All')">
                <div v-if="filteredCategories.length === 0">
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">No results found</h2>
                </div>
                <div v-else v-for="category in filteredCategories" :key="category">
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ category }}</h2>
                    <div class="services-grid grid grid-cols-1 gap-6 rounded-lg">
                        <a v-for="service in filteredServicesByCategory(category)" :key="service.name"
                            :href="`/docs/services/${service.slug}`"
                            class="service-card ark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col no-underline">
                            <div class="w-full h-full flex flex-col dark:default-soft rounded-t-xl p-3">
                                <div class="font-bold text-md text-gray-900 mb-1 dark:text-gray-100">{{ service.name }}
                                </div>
                                <div class="text-gray-500 dark:text-gray-400 text-xs">{{ service.description }}</div>
                            </div>
                            <div class="p-4">
                                <div class="bg-white dark:default-soft w-full h-full min-h-[100px] rounded-lg flex items-center justify-center"
                                    style="background-color: rgba(101, 117, 133, 0.16);">
                                    <img :src="isImageLoading(service.icon) ? getLoadingSpinner() : (hasImageError(service.icon) ? getFallbackImage() : service.icon)"
                                        :alt="service.name" @error="handleImageError(service.name, service.icon)"
                                        class="w-auto h-8 px-2 rounded-lg transition-opacity duration-200"
                                        :class="{ 'opacity-50': isImageLoading(service.icon) }" />
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </template>
            <template v-else>
                <div>
                    <div v-for="category in selectedCategories" :key="category">
                        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ category }}</h2>
                        <div class="services-grid not-found-grid grid grid-cols-1 gap-6 mb-8">
                            <template v-if="filteredServicesByCategory(category).length === 0">
                                <div
                                    class="dark:default-soft h-auto rounded-lg rounded-b-none shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                                    <div class="w-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                        <div class="font-bold text-md mb-1 text-gray-900 dark:text-gray-100">No services
                                            found</div>
                                        <div class="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search
                                            or category filter.</div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <a v-for="service in filteredServicesByCategory(category)" :key="service.name"
                                    :href="`/docs/services/${service.slug}`"
                                    class="dark:default-soft rounded-lg rounded-b-none shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col no-underline">
                                    <div class="w-full h-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                        <div class="font-bold text-md text-gray-900 mb-1 dark:text-gray-100">{{
                                            service.name }}</div>
                                        <div class="text-gray-500 dark:text-gray-400 text-xs">{{ service.description }}
                                        </div>
                                    </div>
                                    <div class="p-4">
                                        <div class="bg-white dark:default-soft w-full h-full min-h-[100px] rounded-lg rounded-b-none flex items-center justify-center"
                                            style="background-color: rgba(101, 117, 133, 0.16);">
                                            <img :src="isImageLoading(service.icon) ? getLoadingSpinner() : (hasImageError(service.icon) ? getFallbackImage() : service.icon)"
                                                :alt="service.name"
                                                @error="handleImageError(service.name, service.icon)"
                                                class="w-auto h-8 px-2 rounded-lg transition-opacity duration-200"
                                                :class="{ 'opacity-50': isImageLoading(service.icon) }" />
                                        </div>
                                    </div>
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

