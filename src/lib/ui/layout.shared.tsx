import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import type { DocsSlots } from 'fumadocs-ui/layouts/notebook';
import { Cloud } from 'reicon-react';
import { DiscordInfo, getDiscordInviteUrl } from '@/components/layout/discord-info';
import { GithubInfo, getGithubRepoUrl } from '@/components/layout/github-info';
import { mobileSearchTriggerSlots, mobileSidebarSlots } from '@/components/layout/mobile-header-controls';
import { publicAssetFallbackPath, site } from '../config/site';

type SharedLayoutOptions = BaseLayoutProps & {
  slots?: BaseLayoutProps['slots'] & Pick<DocsSlots, 'sidebar'>;
};

function CoolifyNavTitle() {
  return (
    <>
      <img
        src={publicAssetFallbackPath('/brand/logo.webp')}
        alt="Coolify logo"
        className="size-6 rounded-md border border-fd-border/60 object-cover shadow-sm"
      />
      <span className="font-semibold tracking-tight">{site.name}</span>
    </>
  );
}

export function baseOptions(): SharedLayoutOptions {
  return {
    links: [
      {
        type: 'icon',
        url: getGithubRepoUrl(),
        text: 'GitHub',
        label: 'GitHub',
        icon: <GithubInfo />,
        external: true,
      },
      {
        type: 'icon',
        url: getDiscordInviteUrl(),
        text: 'Discord',
        label: 'Discord',
        icon: <DiscordInfo />,
        external: true,
      },
      {
        type: 'icon',
        url: 'https://coolify.io/pricing/',
        text: 'Coolify Cloud',
        label: 'Coolify Cloud',
        icon: (
          <>
            <Cloud className="size-4" size={16} weight="Filled" aria-hidden="true" />
            <span>Cloud</span>
          </>
        ),
        external: true,
      },
    ],
    nav: {
      title: <CoolifyNavTitle />,
    },
    slots: {
      searchTrigger: mobileSearchTriggerSlots,
      sidebar: mobileSidebarSlots,
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
