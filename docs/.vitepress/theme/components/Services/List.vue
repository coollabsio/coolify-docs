<style scoped>
.default-soft{
    background: rgba(101, 117, 133, 0.16);
    border-color: #3c3f44;
}

/* Purple checkboxes */
input[type="checkbox"] {
    accent-color: #9333ea; /* purple-600 */
}

.dark input[type="checkbox"] {
    accent-color: #8b5cf6; /* purple-500 */
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
        font-size: 16px; /* Prevents zoom on iOS */
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
    
    .input-container .add-service-btn {
        width: auto;
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
    @apply block p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors duration-200;
}

.service-card:hover {
    @apply bg-gray-50;
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
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const services = [
    {
        name: 'Umami',
        slug: 'umami',
        icon: '/public/images/services/umami.svg',
        description: 'A lightweight, open-source web analytics tool that prioritizes user privacy by not using cookies.',
        category: 'Analytics'
    },
    {
        name: 'Plausible',
        slug: 'plausible',
        icon: '/public/images/services/plausible.svg',
        description: 'A lightweight, open-source web analytics tool that prioritizes user privacy by not using cookies.',
        category: 'Analytics'
    },
    {
        name: 'Activepieces',
        slug: 'activepieces',
        icon: '/public/images/services/activepieces.svg?url',
        description: 'Open source no-code business automation.',
        category: 'Automation'
    },
    {
        name: 'Actual Budget',
        slug: 'actualbudget',
        icon: '/public/images/services/actualbudget.svg',
        description: 'A local-first personal finance tool based on zero-based budgeting.',
        category: 'Finance'
    },
    {
        name: 'Affine',
        slug: 'affine',
        icon: '/public/images/services/affine.svg',
        description: 'Open-source knowledge base and workspace combining docs, whiteboards, and databases.',
        category: 'Productivity'
    },
    {
        name: 'AnythingLLM',
        slug: 'anythingllm',
        icon: '/public/images/services/anythingllm.svg',
        description: 'An open-source LLM client that empowers developers to build and scale workflows quickly.',
        category: 'AI'
    },
    {
        name: 'Apprise API',
        slug: 'apprise-api',
        icon: '/public/images/services/apprise-api.svg',
        description: 'RESTful API for Apprise notification library.',
        category: 'Development'
    },
    {
        name: 'Appsmith',
        slug: 'appsmith',
        icon: '/public/images/services/appsmith.svg',
        description: 'A low-code application platform for building internal tools.',
        category: 'Development'
    },
    {
        name: 'Appwrite',
        slug: 'appwrite',
        icon: '/public/images/services/appwrite.svg',
        description: 'A backend-as-a-service platform that simplifies the web & mobile app development.',
        category: 'Development'
    },
    {
        name: 'Argilla',
        slug: 'argilla',
        icon: '/public/images/services/argilla.svg',
        description: 'An open-source platform for building, training, and evaluating conversational AI models.',
        category: 'AI'
    },
    {
        name: 'Audiobookshelf',
        slug: 'audiobookshelf',
        icon: '/public/images/services/audiobookshelf.svg',
        description: 'Self-hosted audiobook and podcast server.',
        category: 'Media'
    },
    {
        name: 'Authentik',
        slug: 'authentik',
        icon: '/public/images/services/authentik.svg',
        description: 'An open-source Identity Provider, focused on flexibility and versatility.',
        category: 'Security'
    },
    {
        name: 'Baby Buddy',
        slug: 'babybuddy',
        icon: '/public/images/services/babybuddy.svg',
        description: 'It helps parents track their baby\'s daily activities, growth, and health with ease.',
        category: 'Health'
    },
    {
        name: 'Beszel',
        slug: 'beszel',
        icon: '/public/images/services/beszel.svg',
        description: 'Lightweight server monitoring hub with historical data, docker stats, and alerts.',
        category: 'Monitoring'
    },
    {
        name: 'Bitcoin Core',
        slug: 'bitcoin-core',
        icon: '/public/images/services/bitcoin-core.svg',
        description: 'Bitcoin Core full node software.',
        category: 'Crypto'
    },
    {
        name: 'BookStack',
        slug: 'bookstack',
        icon: '/public/images/services/bookstack.svg',
        description: 'Self-hosted wiki-style documentation platform.',
        category: 'Documentation'
    },
    {
        name: 'Browserless',
        slug: 'browserless',
        icon: '/public/images/services/browserless.svg',
        description: 'Headless Chrome as a service.',
        category: 'Development'
    },
    {
        name: 'BudgE',
        slug: 'budge',
        icon: '/public/images/services/budge.svg',
        description: 'A budgeting personal finance app.',
        category: 'Finance'
    },
    {
        name: 'Budibase',
        slug: 'budibase',
        icon: '/public/images/services/budibase.svg',
        description: 'Low-code platform for building internal tools and business apps.',
        category: 'Development'
    },
    {
        name: 'Bugsink',
        slug: 'bugsink',
        icon: '/public/images/services/bugsink.svg',
        description: 'Self-hosted Error Tracking',
        category: 'Development'
    },
    {
        name: 'Cal.com',
        slug: 'calcom',
        icon: '/public/images/services/calcom.svg',
        description: 'Open-source Calendly alternative for scheduling meetings.',
        category: 'Productivity'
    },
    {
        name: 'Calibre-web',
        slug: 'calibre-web',
        icon: '/public/images/services/calibre-web.svg',
        description: 'Web app for browsing, reading and downloading eBooks from a Calibre database.',
        category: 'Media'
    },
    {
        name: 'Castopod',
        slug: 'castopod',
        icon: '/public/images/services/castopod.svg',
        description: 'Open-source podcast hosting platform.',
        category: 'Media'
    },
    {
        name: 'Changedetection',
        slug: 'changedetection',
        icon: '/public/images/services/changedetection.svg',
        description: 'Website change detection monitor and notifications.',
        category: 'Monitoring'
    },
    {
        name: 'Chaskiq',
        slug: 'chaskiq',
        icon: '/public/images/services/chaskiq.svg',
        description: 'Open source customer engagement platform.',
        category: 'Business'
    },
    {
        name: 'Chatwoot',
        slug: 'chatwoot',
        icon: '/public/images/services/chatwoot.svg',
        description: 'Open-source customer engagement suite.',
        category: 'Business'
    },
    {
        name: 'Checkmate',
        slug: 'checkmate',
        icon: '/public/images/services/checkmate.svg',
        description: 'Website monitoring and uptime service.',
        category: 'Monitoring'
    },
    {
        name: 'ClassicPress',
        slug: 'classicpress',
        icon: '/public/images/services/classicpress.svg',
        description: 'A business-focused CMS with a strong community.',
        category: 'CMS'
    },
    {
        name: 'CloudBeaver',
        slug: 'cloudbeaver',
        icon: '/public/images/services/cloudbeaver.svg',
        description: 'Universal database tool with web interface.',
        category: 'Development'
    },
    {
        name: 'Cloudflared',
        slug: 'cloudflared',
        icon: '/public/images/services/cloudflared.svg',
        description: 'Cloudflare Tunnel client.',
        category: 'Networking'
    },
    {
        name: 'Cockpit',
        slug: 'cockpit',
        icon: '/public/images/services/cockpit.svg',
        description: 'Web-based server administration interface.',
        category: 'Administration'
    },
    {
        name: 'Code Server',
        slug: 'code-server',
        icon: '/public/images/services/code-server.svg',
        description: 'Run VS Code on any machine anywhere and access it in the browser.',
        category: 'Development'
    },
    {
        name: 'ConvertX',
        slug: 'convertx',
        icon: '/public/images/services/convertx.svg',
        description: 'File conversion service supporting multiple formats.',
        category: 'Utilities'
    },
    {
        name: 'Convex',
        slug: 'convex',
        icon: '/public/images/services/convex.svg',
        description: 'Backend platform for web developers.',
        category: 'Development'
    },
    {
        name: 'Cryptgeon',
        slug: 'cryptgeon',
        icon: '/public/images/services/cryptgeon.svg',
        description: 'Secure note sharing service with self-destructing messages.',
        category: 'Security'
    },
    {
        name: 'CyberChef',
        slug: 'cyberchef',
        icon: '/public/images/services/cyberchef.svg',
        description: 'Data analysis and manipulation tool for cybersecurity.',
        category: 'Security'
    },
    {
        name: 'Dashboard',
        slug: 'dashboard',
        icon: '/public/images/services/dashboard.svg',
        description: 'A simple dashboard for your server.',
        category: 'Administration'
    },
    {
        name: 'Dashy',
        slug: 'dashy',
        icon: '/public/images/services/dashy.svg',
        description: 'Customizable homepage dashboard for self-hosted services.',
        category: 'Administration'
    },
    {
        name: 'Deno KV',
        slug: 'denokv',
        icon: '/public/images/services/denokv.svg',
        description: 'Deno\'s built-in key-value database service.',
        category: 'Development'
    },
    {
        name: 'Directus',
        slug: 'directus',
        icon: '/public/images/services/directus.svg',
        description: 'An open-source headless CMS and API for custom databases.',
        category: 'CMS'
    },
    {
        name: 'Docker Registry',
        slug: 'docker-registry',
        icon: '/public/images/services/docker-registry.svg',
        description: 'A Docker registry to store and manage your Docker images.',
        category: 'Development'
    },
    {
        name: 'Docmost',
        slug: 'docmost',
        icon: '/public/images/services/docmost.svg',
        description: 'Open-source document collaboration platform.',
        category: 'Documentation'
    },
    {
        name: 'Documenso',
        slug: 'documenso',
        icon: '/public/images/services/documenso.svg',
        description: 'Open-source DocuSign alternative for document signing.',
        category: 'Business'
    },
    {
        name: 'Docuseal',
        slug: 'docuseal',
        icon: '/public/images/services/docuseal.svg',
        description: 'Open source DocuSign alternative.',
        category: 'Business'
    },
    {
        name: 'DokuWiki',
        slug: 'dokuwiki',
        icon: '/public/images/services/dokuwiki.svg',
        description: 'A simple to use and highly versatile Open Source wiki software that doesn\'t require a database.',
        category: 'Documentation'
    },
    {
        name: 'Dolibarr',
        slug: 'dolibarr',
        icon: '/public/images/services/dolibarr.svg',
        description: 'Open-source ERP and CRM software.',
        category: 'Business'
    },
    {
        name: 'Dozzle',
        slug: 'dozzle',
        icon: '/public/images/services/dozzle.svg',
        description: 'Realtime log viewer for docker containers.',
        category: 'Development'
    },
    {
        name: 'Drupal',
        slug: 'drupal',
        icon: '/public/images/services/drupal.svg',
        description: 'Open-source content management system.',
        category: 'CMS'
    },
    {
        name: 'Duplicati',
        slug: 'duplicati',
        icon: '/public/images/services/duplicati.svg',
        description: 'A free backup client that securely stores encrypted, incremental, compressed backups on cloud storage services and remote file servers.',
        category: 'Backup'
    },
    {
        name: 'Easy Appointments',
        slug: 'easyappointments',
        icon: '/public/images/services/easyappointments.svg',
        description: 'Open-source appointment scheduler.',
        category: 'Business'
    },
    {
        name: 'Emby',
        slug: 'emby',
        icon: '/public/images/services/emby.svg',
        description: 'A media server to organize, play, and stream audio and video to a variety of devices.',
        category: 'Media'
    },
    {
        name: 'Emby Stat',
        slug: 'emby-stat',
        icon: '/public/images/services/emby-stat.svg',
        description: 'A simple and easy-to-use Emby statistics dashboard.',
        category: 'Media'
    },
    {
        name: 'Evolution API',
        slug: 'evolution-api',
        icon: '/public/images/services/evolution-api.svg',
        description: 'WhatsApp API service for automation.',
        category: 'Automation'
    },
    {
        name: 'Faraday',
        slug: 'faraday',
        icon: '/public/images/services/faraday.svg',
        description: 'Collaborative penetration testing and vulnerability management platform.',
        category: 'Security'
    },
    {
        name: 'Fider',
        slug: 'fider',
        icon: '/public/images/services/fider.svg',
        description: 'An open platform to collect and organize customer feedback.',
        category: 'Business'
    },
    {
        name: 'Filebrowser',
        slug: 'filebrowser',
        icon: '/public/images/services/filebrowser.svg',
        description: 'A file manager for the web.',
        category: 'File Management'
    },
    {
        name: 'FileFlows',
        slug: 'fileflows',
        icon: '/public/images/services/fileflows.svg',
        description: 'A automatic file processing service.',
        category: 'File Management'
    },
    {
        name: 'Firefly III',
        slug: 'firefly-iii',
        icon: '/public/images/services/firefly-iii.svg',
        description: 'A personal finances manager.',
        category: 'Finance'
    },
    {
        name: 'Firefox',
        slug: 'firefox',
        icon: '/public/images/services/firefox.svg',
        description: 'Firefox browser in a container.',
        category: 'Browser'
    },
    {
        name: 'Flipt',
        slug: 'flipt',
        icon: '/public/images/services/flipt.svg',
        description: 'Open-source feature flag management platform.',
        category: 'Development'
    },
    {
        name: 'Flowise',
        slug: 'flowise',
        icon: '/public/images/services/flowise.svg',
        description: 'Drag & drop UI to build your customized LLM flow.',
        category: 'AI'
    },
    {
        name: 'Forgejo',
        slug: 'forgejo',
        icon: '/public/images/services/forgejo.svg',
        description: 'A self-hosted Git service fork of Gitea.',
        category: 'Development'
    },
    {
        name: 'Formbricks',
        slug: 'formbricks',
        icon: '/public/images/services/formbricks.svg',
        description: 'A form builder for static sites.',
        category: 'Development'
    },
    {
        name: 'FoundryVTT',
        slug: 'foundryvtt',
        icon: '/public/images/services/foundryvtt.svg',
        description: 'Virtual tabletop for tabletop role-playing games.',
        category: 'Gaming'
    },
    {
        name: 'FreeScout',
        slug: 'freescout',
        icon: '/public/images/services/freescout.svg',
        description: 'Help desk and customer support application.',
        category: 'Business'
    },
    {
        name: 'FreshRSS',
        slug: 'freshrss',
        icon: '/public/images/services/freshrss.svg',
        description: 'Free, self-hostable RSS feed aggregator.',
        category: 'RSS'
    },
    {
        name: 'Ghost',
        slug: 'ghost',
        icon: '/public/images/services/ghost.svg',
        description: 'A professional publishing platform.',
        category: 'CMS'
    },
    {
        name: 'Gitea',
        slug: 'gitea',
        icon: '/public/images/services/gitea.svg',
        description: 'A painless self-hosted Git service.',
        category: 'Development'
    },
    {
        name: 'GitLab',
        slug: 'gitlab',
        icon: '/public/images/services/gitlab.svg',
        description: 'DevOps lifecycle tool.',
        category: 'Development'
    },
    {
        name: 'Glance',
        slug: 'glance',
        icon: '/public/images/services/glance.svg',
        description: 'All-in-one Home Server Dashboard.',
        category: 'Administration'
    },
    {
        name: 'Glances',
        slug: 'glances',
        icon: '/public/images/services/glances.svg',
        description: 'Cross-platform system monitoring tool.',
        category: 'Monitoring'
    },
    {
        name: 'GlitchTip',
        slug: 'glitchtip',
        icon: '/public/images/services/glitchtip.svg',
        description: 'An open-source error tracking tool.',
        category: 'Development'
    },
    {
        name: 'Gotenberg',
        slug: 'gotenberg',
        icon: '/public/images/services/gotenberg.svg',
        description: 'A Docker-powered stateless API for PDF files.',
        category: 'Development'
    },
    {
        name: 'Grafana',
        slug: 'grafana',
        icon: '/public/images/services/grafana.svg',
        description: 'The open platform for beautiful analytics and monitoring.',
        category: 'Monitoring'
    },
    {
        name: 'Grocy',
        slug: 'grocy',
        icon: '/public/images/services/grocy.svg',
        description: 'A self-hosted groceries & household management solution for your home.',
        category: 'Home'
    },
    {
        name: 'Heimdall',
        slug: 'heimdall',
        icon: '/public/images/services/heimdall.svg',
        description: 'An elegant solution to organize all your web applications.',
        category: 'Administration'
    },
    {
        name: 'HeyForm',
        slug: 'heyform',
        icon: '/public/images/services/heyform.svg',
        description: 'Open-source form builder for conversational forms.',
        category: 'Development'
    },
    {
        name: 'Hoarder',
        slug: 'hoarder',
        icon: '/public/images/services/hoarder.svg',
        description: 'Self-hosted bookmark manager with AI-powered tagging.',
        category: 'Bookmarks'
    },
    {
        name: 'Homarr',
        slug: 'homarr',
        icon: '/public/images/services/homarr.svg',
        description: 'Customizable browser homepage and dashboard.',
        category: 'Administration'
    },
    {
        name: 'Homepage',
        slug: 'homepage',
        icon: '/public/images/services/homepage.svg',
        description: 'A modern homepage for your server.',
        category: 'Administration'
    },
    {
        name: 'Hoppscotch',
        slug: 'hoppscotch',
        icon: '/public/images/services/hoppscotch.svg',
        description: 'Open-source API development ecosystem.',
        category: 'Development'
    },
    {
        name: 'Immich',
        slug: 'immich',
        icon: '/public/images/services/immich.svg',
        description: 'Self-hosted photo and video backup solution.',
        category: 'Media'
    },
    {
        name: 'Infisical',
        slug: 'infisical',
        icon: '/public/images/services/infisical.svg',
        description: 'Open source secret management platform.',
        category: 'Security'
    },
    {
        name: 'Invoice Ninja',
        slug: 'invoice-ninja',
        icon: '/public/images/services/invoice-ninja.svg',
        description: 'Invoice management system.',
        category: 'Business'
    },
    {
        name: 'IT Tools',
        slug: 'it-tools',
        icon: '/public/images/services/it-tools.svg',
        description: 'Collection of handy online tools for developers.',
        category: 'Development'
    },
    {
        name: 'Jellyfin',
        slug: 'jellyfin',
        icon: '/public/images/services/jellyfin.svg',
        description: 'The Free Software Media System.',
        category: 'Media'
    },
    {
        name: 'Jenkins',
        slug: 'jenkins',
        icon: '/public/images/services/jenkins.svg',
        description: 'Open-source automation server.',
        category: 'Development'
    },
    {
        name: 'Joomla',
        slug: 'joomla',
        icon: '/public/images/services/joomla.svg',
        description: 'Open-source content management system.',
        category: 'CMS'
    },
    {
        name: 'Joplin',
        slug: 'joplin',
        icon: '/public/images/services/joplin.svg',
        description: 'Open-source note taking and to-do application.',
        category: 'Productivity'
    },
    {
        name: 'Jupyter Notebook',
        slug: 'jupyter-notebook-python',
        icon: '/public/images/services/jupyter-notebook-python.svg',
        description: 'Interactive computing environment for Python.',
        category: 'Development'
    },
    {
        name: 'Keycloak',
        slug: 'keycloak',
        icon: '/public/images/services/keycloak.svg',
        description: 'Open-source identity and access management solution.',
        category: 'Security'
    },
    {
        name: 'Kimai',
        slug: 'kimai',
        icon: '/public/images/services/kimai.svg',
        description: 'An open-source time-tracking solution for teams of all sizes.',
        category: 'Business'
    },
    {
        name: 'Kuzzle',
        slug: 'kuzzle',
        icon: '/public/images/services/kuzzle.svg',
        description: 'A powerful backend that enables you to build modern apps faster.',
        category: 'Development'
    },
    {
        name: 'Label Studio',
        slug: 'labelstudio',
        icon: '/public/images/services/labelstudio.svg',
        description: 'Open source data labeling platform.',
        category: 'AI'
    },
    {
        name: 'Langfuse',
        slug: 'langfuse',
        icon: '/public/images/services/langfuse.svg',
        description: 'Open source LLM engineering platform.',
        category: 'AI'
    },
    {
        name: 'LibreOffice',
        slug: 'libreoffice',
        icon: '/public/images/services/libreoffice.svg',
        description: 'Free and open-source office suite.',
        category: 'Productivity'
    },
    {
        name: 'LibreTranslate',
        slug: 'libretranslate',
        icon: '/public/images/services/libretranslate.svg',
        description: 'Free and open-source machine translation API.',
        category: 'AI'
    },
    {
        name: 'Listmonk',
        slug: 'listmonk',
        icon: '/public/images/services/listmonk.svg',
        description: 'Self-hosted newsletter and mailing list manager.',
        category: 'Marketing'
    },
    {
        name: 'LiteLLM',
        slug: 'litellm',
        icon: '/public/images/services/litellm.svg',
        description: 'Open source LLM Gateway to manage authentication, loadbalancing, and spend tracking across 100+ LLMs. All in the OpenAI format.',
        category: 'AI'
    },
    {
        name: 'LiteQueen',
        slug: 'litequeen',
        icon: '/public/images/services/litequeen.svg',
        description: 'Lightweight service management platform.',
        category: 'Administration'
    },
    {
        name: 'Logto',
        slug: 'logto',
        icon: '/public/images/services/logto.svg',
        description: 'Logto is an Auth0 alternative designed for modern apps and SaaS products.',
        category: 'Security'
    },
    {
        name: 'Lowcoder',
        slug: 'lowcoder',
        icon: '/public/images/services/lowcoder.svg',
        description: 'Open-source low-code platform for building internal tools.',
        category: 'Development'
    },
    {
        name: 'Mailpit',
        slug: 'mailpit',
        icon: '/public/images/services/mailpit.svg',
        description: 'Self-hosted email and SMTP testing tool.',
        category: 'Development'
    },
    {
        name: 'Martin',
        slug: 'martin',
        icon: '/public/images/services/martin.svg',
        description: 'PostGIS vector tile server.',
        category: 'Development'
    },
    {
        name: 'Mattermost',
        slug: 'mattermost',
        icon: '/public/images/services/mattermost.svg',
        description: 'Open-source messaging platform for teams.',
        category: 'Communication'
    },
    {
        name: 'Mautic',
        slug: 'mautic',
        icon: '/public/images/services/mautic5.svg',
        description: 'Open-source marketing automation platform.',
        category: 'Marketing'
    },
    {
        name: 'Maybe',
        slug: 'maybe',
        icon: '/public/images/services/maybe.svg',
        description: 'Personal finance and wealth management application.',
        category: 'Finance'
    },
    {
        name: 'Mealie',
        slug: 'mealie',
        icon: '/public/images/services/mealie.svg',
        description: 'Self-hosted recipe manager and meal planner.',
        category: 'Home'
    },
    {
        name: 'MediaWiki',
        slug: 'mediawiki',
        icon: '/public/images/services/mediawiki.svg',
        description: 'A free and open-source wiki software package.',
        category: 'Documentation'
    },
    {
        name: 'Meilisearch',
        slug: 'meilisearch',
        icon: '/public/images/services/meilisearch.svg',
        description: 'A powerful, fast, open-source, easy to use, and deploy search engine.',
        category: 'Search'
    },
    {
        name: 'Metabase',
        slug: 'metabase',
        icon: '/public/images/services/metabase.svg',
        description: 'The simplest, fastest way to share data and analytics inside your company.',
        category: 'Analytics'
    },
    {
        name: 'Metube',
        slug: 'metube',
        icon: '/public/images/services/metube.svg',
        description: 'A self-hosted video sharing platform.',
        category: 'Media'
    },
    {
        name: 'MindsDB',
        slug: 'mindsdb',
        icon: '/public/images/services/mindsdb.svg',
        description: 'Machine learning platform that brings AI to databases.',
        category: 'AI'
    },
    {
        name: 'Minecraft',
        slug: 'minecraft',
        icon: '/public/images/services/minecraft.svg',
        description: 'Minecraft game server.',
        category: 'Gaming'
    },
    {
        name: 'MinIO',
        slug: 'minio',
        icon: '/public/images/services/minio.svg',
        description: 'A high-performance, distributed object storage system.',
        category: 'Storage'
    },
    {
        name: 'Mixpost',
        slug: 'mixpost',
        icon: '/public/images/services/mixpost.svg',
        description: 'Self-hosted social media management software (Buffer alternative).',
        category: 'Social Media'
    },
    {
        name: 'Moodle',
        slug: 'moodle',
        icon: '/public/images/services/moodle.svg',
        description: 'Open-source learning platform.',
        category: 'Education'
    },
    {
        name: 'Mosquitto',
        slug: 'mosquitto',
        icon: '/public/images/services/mosquitto.svg',
        description: 'Open-source MQTT broker.',
        category: 'IoT'
    },
    {
        name: 'N8N',
        slug: 'n8n',
        icon: '/public/images/services/n8n.svg',
        description: 'Workflow automation tool.',
        category: 'Automation'
    },
    {
        name: 'Neon WS Proxy',
        slug: 'neon-ws-proxy',
        icon: '/public/images/services/neon-ws-proxy.svg',
        description: 'WebSocket proxy for Neon database.',
        category: 'Development'
    },
    {
        name: 'Next Image Transformation',
        slug: 'next-image-transformation',
        icon: '/public/images/services/next-image-transformation.svg',
        description: 'Image transformation service for Next.js.',
        category: 'Development'
    },
    {
        name: 'Nextcloud',
        slug: 'nextcloud',
        icon: '/public/images/services/nextcloud.svg',
        description: 'A safe home for all your data.',
        category: 'Storage'
    },
    {
        name: 'Nexus',
        slug: 'nexus',
        icon: '/public/images/services/nexus.svg',
        description: 'A repository manager that allows you to store, manage, and distribute your software artifacts.',
        category: 'Development'
    },
    {
        name: 'Nitropage',
        slug: 'nitropage',
        icon: '/public/images/services/nitropage.svg',
        description: 'Nitropage is an extensible, drag-and-drop website builder based on SolidStart, completely free and open source.',
        category: 'Development'
    },
    {
        name: 'NocoDB',
        slug: 'nocodb',
        icon: '/public/images/services/nocodb.svg',
        description: 'Open Source Airtable Alternative.',
        category: 'Database'
    },
    {
        name: 'NodeBB',
        slug: 'nodebb',
        icon: '/public/images/services/nodebb.svg',
        description: 'Node.js based forum software.',
        category: 'Forum'
    },
    {
        name: 'Ntfy',
        slug: 'ntfy',
        icon: '/public/images/services/ntfy.svg',
        description: 'Simple HTTP-based pub-sub notification service.',
        category: 'Notifications'
    },
    {
        name: 'Odoo',
        slug: 'odoo',
        icon: '/public/images/services/odoo.svg',
        description: 'Open source ERP and CRM.',
        category: 'Business'
    },
    {
        name: 'Ollama',
        slug: 'ollama',
        icon: '/public/images/services/ollama.svg',
        description: 'A lightweight and efficient server for running large language models (LLMs) on your local machine or in the cloud.',
        category: 'AI'
    },
    {
        name: 'OneDev',
        slug: 'onedev',
        icon: '/public/images/services/onedev.svg',
        description: 'Self-hosted Git server with integrated CI/CD and kanban.',
        category: 'Development'
    },
    {
        name: 'Open WebUI',
        slug: 'open-webui',
        icon: '/public/images/services/open-webui.svg',
        description: 'User-friendly WebUI for LLMs, formerly Ollama WebUI.',
        category: 'AI'
    },
    {
        name: 'Openblocks',
        slug: 'openblocks',
        icon: '/public/images/services/openblocks.svg',
        description: 'Open-source low code platform.',
        category: 'Development'
    },
    {
        name: 'Organizr',
        slug: 'organizr',
        icon: '/public/images/services/organizr.svg',
        description: 'Homepage organizer for your server services.',
        category: 'Administration'
    },
    {
        name: 'osTicket',
        slug: 'osticket',
        icon: '/public/images/services/osticket.svg',
        description: 'Open-source help desk ticketing system.',
        category: 'Business'
    },
    {
        name: 'Outline',
        slug: 'outline',
        icon: '/public/images/services/outline.svg',
        description: 'Open-source collaboration tool.',
        category: 'Productivity'
    },
    {
        name: 'Overseerr',
        slug: 'overseerr',
        icon: '/public/images/services/overseerr.svg',
        description: 'A request management and media discovery tool built to work with your existing Plex ecosystem.',
        category: 'Media'
    },
    {
        name: 'ownCloud',
        slug: 'owncloud',
        icon: '/public/images/services/owncloud.svg',
        description: 'File synchronization and sharing platform.',
        category: 'Storage'
    },
    {
        name: 'Pairdrop',
        slug: 'pairdrop',
        icon: '/public/images/services/pairdrop.svg',
        description: 'Local file sharing in your browser.',
        category: 'File Sharing'
    },
    {
        name: 'Paperless',
        slug: 'paperless',
        icon: '/public/images/services/paperless.svg',
        description: 'Document management system that transforms physical documents into searchable online archives.',
        category: 'Documentation'
    },
    {
        name: 'Paymenter',
        slug: 'paymenter',
        icon: '/public/images/services/paymenter.svg',
        description: 'Open-Source Billing, Built for Hosting Providers.',
        category: 'Business'
    },
    {
        name: 'Penpot',
        slug: 'penpot',
        icon: '/public/images/services/penpot.svg',
        description: 'Open Source design & prototyping platform.',
        category: 'Design'
    },
    {
        name: 'phpMyAdmin',
        slug: 'phpmyadmin',
        icon: '/public/images/services/phpmyadmin.svg',
        description: 'MySQL database management tool.',
        category: 'Development'
    },
    {
        name: 'Plane',
        slug: 'plane',
        icon: '/public/images/services/plane.svg',
        description: 'Open source project planning tool.',
        category: 'Project Management'
    },
    {
        name: 'Plex',
        slug: 'plex',
        icon: '/public/images/services/plex.svg',
        description: 'Media server software.',
        category: 'Media'
    },
    {
        name: 'Plunk',
        slug: 'plunk',
        icon: '/public/images/services/plunk.svg',
        description: 'Self-hosted email marketing platform.',
        category: 'Marketing'
    },
    {
        name: 'Pocketbase',
        slug: 'pocketbase',
        icon: '/public/images/services/pocketbase.svg',
        description: 'Open Source backend for your next SaaS and Mobile app.',
        category: 'Development'
    },
    {
        name: 'Portainer',
        slug: 'portainer',
        icon: '/public/images/services/portainer.svg',
        description: 'Container management platform.',
        category: 'Development'
    },
    {
        name: 'PostHog',
        slug: 'posthog',
        icon: '/public/images/services/posthog.svg',
        description: 'Open source product analytics.',
        category: 'Analytics'
    },
    {
        name: 'Postiz',
        slug: 'postiz',
        icon: '/public/images/services/postiz.svg',
        description: 'Social media scheduling and analytics tool.',
        category: 'Social Media'
    },
    {
        name: 'Prefect',
        slug: 'prefect',
        icon: '/public/images/services/prefect.svg',
        description: 'Open source workflow management platform.',
        category: 'Development'
    },
    {
        name: 'PrivateBin',
        slug: 'privatebin',
        icon: '/public/images/services/privatebin.svg',
        description: 'Minimalist, open-source online pastebin.',
        category: 'Development'
    },
    {
        name: 'Prowlarr',
        slug: 'prowlarr',
        icon: '/public/images/services/prowlarr.svg',
        description: 'A free and open source BitTorrent client.',
        category: 'Media'
    },
    {
        name: 'qBittorrent',
        slug: 'qbittorrent',
        icon: '/public/images/services/qbittorrent.svg',
        description: 'Free and open-source BitTorrent client.',
        category: 'Media'
    },
    {
        name: 'Qdrant',
        slug: 'qdrant',
        icon: '/public/images/services/qdrant.svg',
        description: 'Open source, AI-native vector database.',
        category: 'AI'
    },
    {
        name: 'RabbitMQ',
        slug: 'rabbitmq',
        icon: '/public/images/services/rabbitmq.svg',
        description: 'Open source message broker.',
        category: 'Development'
    },
    {
        name: 'Radarr',
        slug: 'radarr',
        icon: '/public/images/services/radarr.svg',
        description: 'A Media server software.',
        category: 'Media'
    },
    {
        name: 'Rallly',
        slug: 'rallly',
        icon: '/public/images/services/rallly.svg',
        description: 'Open-source meeting scheduling tool.',
        category: 'Productivity'
    },
    {
        name: 'Reactive Resume',
        slug: 'reactive-resume',
        icon: '/public/images/services/reactive-resume.svg',
        description: 'A free and open source resume builder.',
        category: 'Productivity'
    },
    {
        name: 'Readeck',
        slug: 'readeck',
        icon: '/public/images/services/readeck.svg',
        description: 'Web article reader and bookmark manager.',
        category: 'Productivity'
    },
    {
        name: 'Redlib',
        slug: 'redlib',
        icon: '/public/images/services/redlib.svg',
        description: 'Private front-end for Reddit.',
        category: 'Social Media'
    },
    {
        name: 'Rocket.Chat',
        slug: 'rocketchat',
        icon: '/public/images/services/rocketchat.svg',
        description: 'Open source team chat software.',
        category: 'Communication'
    },
    {
        name: 'SearXNG',
        slug: 'searxng',
        icon: '/public/images/services/searxng.svg',
        description: 'Open source search engine.',
        category: 'Search'
    },
    {
        name: 'Shlink',
        slug: 'shlink',
        icon: '/public/images/services/shlink.svg',
        description: 'The open source URL shortener.',
        category: 'Development'
    },
    {
        name: 'Slash',
        slug: 'slash',
        icon: '/public/images/services/slash.svg',
        description: 'Open-source, self-hosted links and notes manager.',
        category: 'Productivity'
    },
    {
        name: 'Snapdrop',
        slug: 'snapdrop',
        icon: '/public/images/services/snapdrop.svg',
        description: 'Local file sharing in your browser.',
        category: 'File Sharing'
    },
    {
        name: 'Soketi',
        slug: 'soketi',
        icon: '/public/images/services/soketi.svg',
        description: 'Open-source WebSocket server.',
        category: 'Development'
    },
    {
        name: 'Sonarr',
        slug: 'sonarr',
        icon: '/public/images/services/sonarr.svg',
        description: 'A internet PVR for Usenet and Torrents.',
        category: 'Media'
    },
    {
        name: 'Statusnook',
        slug: 'statusnook',
        icon: '/public/images/services/statusnook.svg',
        description: 'A status page system for your website.',
        category: 'Monitoring'
    },
    {
        name: 'Stirling PDF',
        slug: 'stirling-pdf',
        icon: '/public/images/services/stirling-pdf.svg',
        description: 'Powerful PDF manipulation tool.',
        category: 'Documentation'
    },
    {
        name: 'Strapi',
        slug: 'strapi',
        icon: '/public/images/services/strapi.svg',
        description: 'Open-source headless CMS.',
        category: 'CMS'
    },
    {
        name: 'Supabase',
        slug: 'supabase',
        icon: '/public/images/services/supabase.svg',
        description: 'Open source Firebase alternative.',
        category: 'Development'
    },
    {
        name: 'Superset',
        slug: 'superset',
        icon: '/public/images/services/superset.svg',
        description: 'Open-source data visualization and exploration platform.',
        category: 'Analytics'
    },
    {
        name: 'SuperTokens',
        slug: 'supertokens',
        icon: '/public/images/services/supertokens.svg',
        description: 'Open-source authentication solution.',
        category: 'Security'
    },
    {
        name: 'Syncthing',
        slug: 'syncthing',
        icon: '/public/images/services/syncthing.svg',
        description: 'Open Source Continuous File Synchronization.',
        category: 'File Management'
    },
    {
        name: 'Teable',
        slug: 'teable',
        icon: '/public/images/services/teable.svg',
        description: 'No-code database built on PostgreSQL.',
        category: 'Database'
    },
    {
        name: 'Tolgee',
        slug: 'tolgee',
        icon: '/public/images/services/tolgee.svg',
        description: 'Open source localization platform.',
        category: 'Development'
    },
    {
        name: 'Traccar',
        slug: 'traccar',
        icon: '/public/images/services/traccar.svg',
        description: 'Open-source GPS tracking platform.',
        category: 'IoT'
    },
    {
        name: 'Transmission',
        slug: 'transmission',
        icon: '/public/images/services/transmission.svg',
        description: 'Fast, easy, and free BitTorrent client.',
        category: 'Media'
    },
    {
        name: 'Trigger',
        slug: 'trigger',
        icon: '/public/images/services/trigger.svg',
        description: 'Open-source workflow automation tool.',
        category: 'Automation'
    },
    {
        name: 'Unleash',
        slug: 'unleash',
        icon: '/public/images/services/unleash.svg',
        description: 'Open-source feature management platform.',
        category: 'Development'
    },
    {
        name: 'Unsend',
        slug: 'unsend',
        icon: '/public/images/services/unsend.svg',
        description: 'Open-source email recall service.',
        category: 'Email'
    },
    {
        name: 'Unstructured',
        slug: 'unstructured',
        icon: '/public/images/services/unstructured.svg',
        description: 'Open-source platform and tools to ingest and process unstructured documents for Retrieval Augmented Generation (RAG) and model fine-tuning.',
        category: 'AI'
    },
    {
        name: 'Uptime Kuma',
        slug: 'uptime-kuma',
        icon: '/public/images/services/uptime-kuma.svg',
        description: 'A fancy self-hosted monitoring tool.',
        category: 'Monitoring'
    },
    {
        name: 'Vaultwarden',
        slug: 'vaultwarden',
        icon: '/public/images/services/vaultwarden.svg',
        description: 'Unofficial Bitwarden compatible server.',
        category: 'Security'
    },
    {
        name: 'Vikunja',
        slug: 'vikunja',
        icon: '/public/images/services/vikunja.svg',
        description: 'The open-source to-do app.',
        category: 'Productivity'
    },
    {
        name: 'VvvebJs',
        slug: 'vvveb',
        icon: '/public/images/services/vvveb.svg',
        description: 'Powerful website builder with drag and drop functionality.',
        category: 'Development'
    },
    {
        name: 'Wakapi',
        slug: 'wakapi',
        icon: '/public/images/services/wakapi.svg',
        description: 'Open-source coding activity tracker.',
        category: 'Development'
    },
    {
        name: 'Weaviate',
        slug: 'weaviate',
        icon: '/public/images/services/weaviate.svg',
        description: 'Open source, AI-native vector database.',
        category: 'AI'
    },
    {
        name: 'Web Check',
        slug: 'web-check',
        icon: '/public/images/services/web-check.svg',
        description: 'All-in-one website analysis tool.',
        category: 'Development'
    },
    {
        name: 'Weblate',
        slug: 'weblate',
        icon: '/public/images/services/weblate.svg',
        description: 'Web-based translation tool.',
        category: 'Development'
    },
    {
        name: 'Whoogle',
        slug: 'whoogle',
        icon: '/public/images/services/whoogle.svg',
        description: 'Self-hosted, ad-free, privacy-respecting metasearch engine.',
        category: 'Search'
    },
    {
        name: 'Wiki.js',
        slug: 'wikijs',
        icon: '/public/images/services/wikijs.svg',
        description: 'Modern and powerful wiki software built on Node.js.',
        category: 'Documentation'
    },
    {
        name: 'Windmill',
        slug: 'windmill',
        icon: '/public/images/services/windmill.svg',
        description: 'Open-source developer platform.',
        category: 'Development'
    },
    {
        name: 'WireGuard Easy',
        slug: 'wireguard-easy',
        icon: '/public/images/services/wireguard-easy.svg',
        description: 'Easy-to-use WireGuard VPN server.',
        category: 'Security'
    },
    {
        name: 'WordPress',
        slug: 'wordpress',
        icon: '/public/images/services/wordpress.svg',
        description: 'Website and blogging platform.',
        category: 'CMS'
    },
    {
        name: 'Zipline',
        slug: 'zipline',
        icon: '/public/images/services/zipline.svg',
        description: 'Next generation ShareX / File upload server',
        category: 'File Management'
    },
    {
        name: 'MetaMCP',
        slug: 'metamcp',
        icon: '/public/images/services/metamcp.png',
        description: 'MCP Aggregator, Orchestrator, Middleware, Gateway in one application.',
        category: 'AI'
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
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const filteredServicesByCategory = (category: string) => {
    return services.filter(s =>
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

const navigateTo = (path: string, external: boolean = false) => {
    if (external) {
        window.location.href = path
    } else {
        window.location.href = `/docs/${path}`
    }
}

// Fallback image composable
const useImageFallback = () => {
    const imageErrors = ref(new Set<string>())
    
    const handleImageError = (serviceName: string) => {
        imageErrors.value.add(serviceName)
    }
    
    const hasImageError = (serviceName: string) => {
        return imageErrors.value.has(serviceName)
    }
    
    const getFallbackImage = () => {
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAwIiB6b29tQW5kUGFuPSJtYWduaWZ5IiB2aWV3Qm94PSIwIDAgMzc1IDM3NC45OTk5OTEiIGhlaWdodD0iNTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWVNpZCBtZWV0IiB2ZXJzaW9uPSIxLjAiPjxkZWZzPjxnLz48L2RlZnM+PGcgZmlsbD0iIzhjNTJmZiIgZmlsbC1vcGFjaXR5PSIwLjMwMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODQuNjYzNzkzLCAzMTAuMDE2NDg0KSI+PGc+PHBhdGggZD0iTSA2MyAtMTY4IEwgMjEgLTE2OCBMIDIxIC00MiBMIDYzIC00MiBaIE0gNjMgMCBMIDIzMSAwIEwgMjMxIC00MiBMIDYzIC00MiBaIE0gNjMgLTE2OCBMIDIzMSAtMTY4IEwgMjMxIC0yMTAgTCA2MyAtMjEwIFogTSA2MyAtMTY4ICIvPjwvZz48L2c+PC9nPjxnIGZpbGw9IiM4YzUyZmYiIGZpbGwtb3BhY2l0eT0iMC41MDIiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcxLjQwNTUzNywgMjk2Ljc1ODIzMykiPjxnPjxwYXRoIGQ9Ik0gNjMgLTE2OCBMIDIxIC0xNjggTCAyMSAtNDIgTCA2MyAtNDIgWiBNIDYzIDAgTCAyMzEgMCBMIDIzMSAtNDIgTCA2MyAtNDIgWiBNIDYzIC0xNjggTCAyMzEgLTE2OCBMIDIzMSAtMjEwIEwgNjMgLTIxMCBaIE0gNjMgLTE2OCAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjOGM1MmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU4LjE0NzI4NywgMjgzLjQ5OTk4MSkiPjxnPjxwYXRoIGQ9Ik0gNjMgLTE2OCBMIDIxIC0xNjggTCAyMSAtNDIgTCA2MyAtNDIgWiBNIDYzIDAgTCAyMzEgMCBMIDIzMSAtNDIgTCA2MyAtNDIgWiBNIDYzIC0xNjggTCAyMzEgLTE2OCBMIDIzMSAtMjEwIEwgNjMgLTIxMCBaIE0gNjMgLTE2OCAiLz48L2c+PC9nPjwvZz48L3N2Zz4="
    }
    
    return {
        imageErrors,
        handleImageError,
        hasImageError,
        getFallbackImage
    }
}

const { handleImageError, hasImageError, getFallbackImage } = useImageFallback()
</script>


<template>
    <div class="flex flex-col">
        <div class="input-container w-full flex flex-col justify-between gap-2">
            <input v-model="search" type="text" placeholder="Search"
                class="search w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg py-3 sm:py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800" style="background-color: rgba(101, 117, 133, 0.16);" />
            <div class="button-group relative flex flex-col gap-2" ref="dropdownRef">
                <button @click.stop="isOpen = !isOpen" 
                    class="select flex items-center justify-between w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 sm:px-3 sm:py-2 bg-purple-700 dark:bg-purple-600 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800" style="background-color: rgba(101, 117, 133, 0.16);">
                    <span class="text-sm sm:text-base">{{ selectedCategories.length === 1 ? selectedCategories[0] : `${selectedCategories.length} categories` }}</span>
                    <svg class="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div v-if="isOpen" 
                    class="dropdown-content absolute z-10 top-full left-0 right-0 rounded-lg shadow-lg bg-white dark:!bg-[#23272f] border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <div class="p-2">
                        <label class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <input type="checkbox" 
                                :checked="selectedCategories.includes('All')"
                                @change="toggleCategory('All')"
                                class="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-800">
                            <span class="text-gray-900 dark:text-white">All Categories</span>
                        </label>
                        <div v-for="category in categories" :key="category" class="mt-1">
                            <label class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                <input type="checkbox" 
                                    :checked="selectedCategories.includes(category)"
                                    @change="toggleCategory(category)"
                                    class="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-800">
                                <span class="text-gray-900 dark:text-white">{{ category }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <button @click="navigateTo('https://github.com/coollabsio/coolify/blob/v4.x/CONTRIBUTING.md', true)" class="add-service-btn text-gray-900 dark:text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base w-full" style="background-color: rgba(101, 117, 133, 0.16);" onmouseover="this.style.backgroundColor='rgba(75, 85, 99, 0.25)'" onmouseout="this.style.backgroundColor='rgba(101, 117, 133, 0.16)'">
                    Add Service
                </button>
            </div>
        </div>
        <div class="grid-container">
            <template v-if="selectedCategories.includes('All')">
                <div v-if="filteredCategories.length === 0">
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">No results found</h2>
                    <div class="services-grid not-found-grid grid grid-cols-1 gap-6">
                        <div class="dark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                            <div class="w-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                <div class="font-bold text-md mb-1 text-gray-900 dark:text-gray-100">Service not found</div>
                                <div class="text-gray-500 dark:text-gray-400 text-xs">Try adjusting your search or category filter.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else v-for="category in filteredCategories" :key="category">
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ category }}</h2>
                    <div class="services-grid grid grid-cols-1 gap-6 rounded-lg">
                        <div v-for="service in filteredServicesByCategory(category)" :key="service.name" @click="navigateTo(`services/${service.slug}`)"
                            class="dark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                            <div class="w-full h-full flex flex-col dark:default-soft rounded-t-xl p-3">
                                <div class="font-bold text-md text-gray-900 mb-1 dark:text-gray-100">{{ service.name }}</div>
                                <div class="text-gray-500 dark:text-gray-400 text-xs">{{ service.description }}</div>
                            </div>
                            <div class="p-4">
                                <div class="bg-white dark:default-soft w-full h-full min-h-[100px] rounded-lg flex items-center justify-center" style="background-color: rgba(101, 117, 133, 0.16);">
                                    <img 
                                        :src="hasImageError(service.name) ? getFallbackImage() : `https://raw.githubusercontent.com/coollabsio/coolify-docs/db61a7c5175b48b638cbc445980370af68374921/docs/public/images/services/${service.name.toLowerCase()}.svg`"
                                        :alt="service.name" 
                                        @error="handleImageError(service.name)"
                                        class="w-auto h-8 px-2 rounded-lg" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div>
                    <div v-for="category in selectedCategories" :key="category">
                        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ category }}</h2>
                        <div class="services-grid not-found-grid grid grid-cols-1 gap-6 mb-8">
                            <template v-if="filteredServicesByCategory(category).length === 0">
                                <div class="dark:default-soft h-auto rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                                    <div class="w-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                        <div class="font-bold text-md mb-1 text-gray-900 dark:text-gray-100">No services found</div>
                                        <div class="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or category filter.</div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="service in filteredServicesByCategory(category)" :key="service.name" @click="navigateTo(`services/${service.slug}`)"
                                    class="dark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                                    <div class="w-full h-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                        <div class="font-bold text-md text-gray-900 mb-1 dark:text-gray-100">{{ service.name }}</div>
                                        <div class="text-gray-500 dark:text-gray-400 text-xs">{{ service.description }}</div>
                                    </div>
                                    <div class="p-4">
                                        <div class="bg-white dark:default-soft w-full h-full min-h-[100px] rounded-lg flex items-center justify-center" style="background-color: rgba(101, 117, 133, 0.16);">
                                            <img 
                                                :src="hasImageError(service.name) ? getFallbackImage() : `https://raw.githubusercontent.com/coollabsio/coolify-docs/db61a7c5175b48b638cbc445980370af68374921/docs/public/images/services/${service.name.toLowerCase()}.svg`"
                                                :alt="service.name" 
                                                @error="handleImageError(service.name)"
                                                class="w-auto h-8 px-2 rounded-lg" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>