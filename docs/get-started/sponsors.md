---
layout: page
title: Coolify Sponsors
description: Meet the companies and organizations sponsoring Coolify development including Hetzner, Logto, Tolgee, and other technology partners.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'


const sponsors = [
  {
    avatar: '../images/sponsors/hetzner.webp',
    name: 'Hetzner',
    title: 'Server, cloud, hosting, and data center solutions',
    links: [
      { icon: 'expedia', link: 'http://htznr.li/CoolifyXHetzner' }
    ]
  },
  {
    avatar: '../images/sponsors/logto.webp',
    name: 'Logto',
    title: 'The better identity infrastructure for developers',
    links: [
      { icon: 'expedia', link: 'https://logto.io/?ref=coolify' }
    ]
  },
  {
    avatar: '../images/sponsors/tolgee.webp',
    name: 'Tolgee',
    title: 'The open source localization platform',
    links: [
      { icon: 'expedia', link: 'https://tolgee.io/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/bc.webp',
    name: 'Best Consultant',
    title: 'Your trusted technology consulting partner',
    links: [
      { icon: 'expedia', link: 'https://bc.direct/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/quant.webp',
    name: 'QuantCDN',
    title: 'Enterprise-grade content delivery network',
    links: [
      { icon: 'expedia', link: 'https://www.quantcdn.io/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/arcjet.webp',
    name: 'Arcjet',
    title: 'Advanced web security and performance solutions',
    links: [
      { icon: 'expedia', link: 'https://arcjet.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/supaguide.webp',
    name: 'SupaGuide',
    title: 'Your comprehensive guide to Supabase',
    links: [
      { icon: 'expedia', link: 'https://supa.guide/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/coderabbit.webp',
    name: 'CodeRabbit',
    title: 'Cut Code Review Time & Bugs in Half',
    links: [
      { icon: 'expedia', link: 'https://coderabbit.ai/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/convex.webp',
    name: 'Convex',
    title: 'Open-source reactive database for web app developers',
    links: [
      { icon: 'expedia', link: 'https://convex.link/coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/goldenvm.webp',
    name: 'GoldenVM',
    title: 'Premium virtual machine hosting solutions',
    links: [
      { icon: 'expedia', link: 'https://billing.goldenvm.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/tigris.webp',
    name: 'Tigris',
    title: 'Modern developer data platform',
    links: [
      { icon: 'expedia', link: 'https://www.tigrisdata.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/cloudify.webp',
    name: 'Cloudify',
    title: 'Cloud hosting solutions',
    links: [
      { icon: 'expedia', link: 'https://cloudify.ro/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/trieve.webp',
    name: 'Trieve',
    title: 'AI-powered search and analytics',
    links: [
      { icon: 'expedia', link: 'https://trieve.ai/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/blacksmith.webp',
    name: 'Blacksmith',
    title: 'Infrastructure automation platform',
    links: [
      { icon: 'expedia', link: 'https://blacksmith.sh/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/comit.webp',
    name: 'Comit International',
    title: 'New York Times award–winning contractor!',
    links: [
      { icon: 'expedia', link: 'https://comit.international/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/branddev.webp',
    name: 'Brand.dev',
    title: 'The #1 Brand API for B2B software startups',
    links: [
      { icon: 'expedia', link: 'https://brand.dev/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/syntax.webp',
    name: 'Syntax.fm',
    title: 'Podcast for web developers',
    links: [
      { icon: 'expedia', link: 'https://syntax.fm?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/jobscollider.webp',
    name: 'Jobs Collider',
    title: '30,000+ remote jobs for developers',
    links: [
      { icon: 'expedia', link: 'https://jobscollider.com/remote-jobs?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/hostinger.webp',
    name: 'Hostinger',
    title: 'Web hosting and VPS solutions',
    links: [
      { icon: 'expedia', link: 'https://www.hostinger.com/vps/coolify-hosting?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/glueops.webp',
    name: 'GlueOps',
    title: 'DevOps automation and infrastructure management',
    links: [
      { icon: 'expedia', link: 'https://www.glueops.dev/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/ubicloud.webp',
    name: 'Ubicloud',
    title: 'Open source cloud infrastructure platform',
    links: [
      { icon: 'expedia', link: 'https://www.ubicloud.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/pfglabs.webp',
    name: 'Pfglabs',
    title: 'Build Real Projects with Golang',
    links: [
      { icon: 'expedia', link: 'https://pfglabs.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/juxtdigital.webp',
    name: 'JuxtDigital',
    title: 'Digital transformation and web solutions',
    links: [
      { icon: 'expedia', link: 'https://juxtdigital.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/saasykit.webp',
    name: 'SaasyKit',
    title: 'Complete SaaS starter kit for developers',
    links: [
      { icon: 'expedia', link: 'https://saasykit.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/massivegrid.webp',
    name: 'MassiveGrid',
    title: 'Enterprise cloud hosting solutions',
    links: [
      { icon: 'expedia', link: 'https://massivegrid.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/americancloud.webp',
    name: 'American Cloud',
    title: 'US-based cloud infrastructure services',
    links: [
      { icon: 'expedia', link: 'https://americancloud.com/?utm_source=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/algora.webp',
    name: 'Algora',
    title: 'Open source contribution platform',
    links: [
      { icon: 'expedia', link: 'https://algora.io/?utm_source=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/liquidweb.webp',
    name: 'LiquidWeb',
    title: 'Premium managed hosting solutions',
    links: [
      { icon: 'expedia', link: 'https://liquidweb.com/?utm_source=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/yaak.webp',
    name: 'Yaak',
    title: 'The API client for modern developers',
    links: [
      { icon: 'expedia', link: 'https://yaak.app/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/comp.webp',
    name: 'Comp AI',
    title: 'The open-source platform that automates compliance',
    links: [
      { icon: 'expedia', link: 'https://www.trycomp.ai/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/darweb.webp',
    name: 'Darweb',
    title: 'Design. Develop. Deliver. Specialized in 3D CPQ Solutions for eCommerce',
    links: [
      { icon: 'expedia', link: 'https://darweb.nl/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/wzit.webp',
    name: 'WZ-IT',
    title: 'German agency for customized cloud solutions, migration, managed services and open source hosting',
    links: [
      { icon: 'expedia', link: 'https://wz-it.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/supadata.webp',
    name: 'Supadata',
    title: 'Scrape YouTube, web, and files. Get AI-ready, clean data for your next project',
    links: [
      { icon: 'expedia', link: 'https://supadata.ai/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/gozunga.webp',
    name: 'Gozunga',
    title: 'Seriously Simple Cloud Infrastructure',
    links: [
      { icon: 'expedia', link: 'https://gozunga.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/sponsors/macarne.webp',
    name: 'Macarne',
    title: 'Best IP Transit & Carrier Ethernet Solutions for Simplified Network Connectivity',
    links: [
      { icon: 'expedia', link: 'https://macarne.com/?ref=coolify.io' }
    ]
  },
  {
    avatar: '../images/team/coollabs-logo-smaller.webp',
    name: 'Your Company?',
    title: 'Will Your Company Be Next?'
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Coolify Sponsors
    </template>
    <template #lead>
      We have amazing sponsors who support the development of Coolify.
    </template>
  </VPTeamPageTitle>
<VPTeamMembers size="small" :members="sponsors" />
</VPTeamPage>
