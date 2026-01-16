---
layout: page
title: coolLabs Team
description: Meet the international team developing Coolify including founder Andras Bacsai, core developers, community leads, and documentation maintainers.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'


const coreMembers = [
  {
    avatar: '../images/team/andras.webp',
    name: 'Andras Bacsai',
    title: 'Founder, Lead Developer',
    links: [
      { icon: 'github', link: 'https://github.com/andrasbacsai' },
      { icon: 'expedia', link: 'https://heyandras.dev' },
      { icon: 'x', link: 'https://x.com/heyandras' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/heyandras.dev' }
    ]
  },
  {
    avatar: '../images/team/peak.webp',
    name: 'Peaklabs Dev',
    title: 'Core Developer',
    links: [
      { icon: 'github', link: 'https://github.com/peaklabs-dev' },
      { icon: 'x', link: 'https://x.com/peaklabs_dev' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/peaklabs.dev' },
      { icon: 'mastodon', link: 'https://fosstodon.org/@peaklabs_dev' }
    ]
  },
  {
    avatar: '../images/team/shadowarcanist.webp',
    name: 'ShadowArcanist',
    title: 'Community Lead, Docs Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/shadowarcanist' },
      { icon: 'expedia', link: 'https://shadowarcanist.com' },
      { icon: 'x', link: 'https://x.com/shadowarcanist' }
    ]
  },
  {
    avatar: '../images/team/aditya.webp',
    name: 'Aditya Tripathi',
    title: 'Developer, Community Moderator',
    links: [
      { icon: 'github', link: 'https://github.com/adiologydev' },
      { icon: 'expedia', link: 'https://adiology.dev' },
      { icon: 'x', link: 'https://x.com/AdityaTripathiD' }
    ]
  },
  {
    avatar: '../images/team/oren.webp',
    name: 'Oren Aksakal',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/orenaksakal' },
      { icon: 'x', link: 'https://x.com/orenaksakal' }
    ]
  },
  {
    avatar: '../images/team/coollabs.webp',
    name: 'You?',
    title: 'Will You Be Next?'
  }
]

</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      coolLabs Team
    </template>
    <template #lead>
      The development of Coolify is guided by an international team, some of whom have chosen to be featured below.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers size="small" :members="coreMembers" />
</VPTeamPage>
