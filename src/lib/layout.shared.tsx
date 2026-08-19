import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { publicAssetFallbackPath, site } from './site';

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

export function baseOptions(): BaseLayoutProps {
  return {
    links: [
      {
        type: 'main',
        url: 'https://coolify.io/pricing',
        text: 'Coolify Cloud',
        external: true,
      },
      {
        type: 'icon',
        url: 'https://github.com/coollabsio/coolify',
        text: 'GitHub',
        label: 'GitHub',
        icon: (
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        ),
        external: true,
      },
      {
        type: 'icon',
        url: 'https://coollabs.io/discord',
        text: 'Discord',
        label: 'Discord',
        icon: (
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
            <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.347-.408.813-.558 1.177a18.27 18.27 0 0 0-5.304 0A12.64 12.64 0 0 0 9.46 3a19.736 19.736 0 0 0-4.438 1.372C2.218 8.537 1.456 12.596 1.838 16.598A19.91 19.91 0 0 0 7.284 19.32a13.443 13.443 0 0 0 1.169-1.907 12.59 12.59 0 0 1-1.844-.88c.155-.114.307-.233.454-.355 3.555 1.64 7.414 1.64 10.927 0 .15.122.302.24.454.355-.593.348-1.21.644-1.844.88.34.66.73 1.296 1.17 1.907a19.88 19.88 0 0 0 5.45-2.722c.456-4.64-.78-8.664-3.903-12.23M8.02 14.176c-1.066 0-1.94-.98-1.94-2.185 0-1.206.857-2.185 1.94-2.185 1.092 0 1.957.988 1.94 2.185 0 1.206-.857 2.185-1.94 2.185m7.14 0c-1.067 0-1.94-.98-1.94-2.185 0-1.206.856-2.185 1.94-2.185 1.091 0 1.956.988 1.939 2.185 0 1.206-.848 2.185-1.94 2.185" />
          </svg>
        ),
        external: true,
      },
    ],
    nav: {
      title: <CoolifyNavTitle />,
    },
  };
}
