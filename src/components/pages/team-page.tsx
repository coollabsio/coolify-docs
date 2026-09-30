import { GlobePointer, UserTick2 } from 'reicon-react';

type TeamLink = {
  label: string;
  href: string;
};

type TeamMember = {
  name: string;
  role: string;
  image: string;
  links: TeamLink[];
  variant?: 'join';
};

const teamMembers: TeamMember[] = [
  {
    name: 'Andras Bacsai',
    role: 'Founder, Lead Developer',
    image: '/docs/images/team/andras.webp',
    links: [
      { label: 'GitHub', href: 'https://github.com/andrasbacsai' },
      { label: 'Website', href: 'https://heyandras.dev' },
      { label: 'X', href: 'https://x.com/heyandras' },
      { label: 'Bluesky', href: 'https://bsky.app/profile/heyandras.dev' },
    ],
  },
  {
    name: 'Peaklabs Dev',
    role: 'Core Developer',
    image: '/docs/images/team/peak.webp',
    links: [
      { label: 'GitHub', href: 'https://github.com/peaklabs-dev' },
      { label: 'X', href: 'https://x.com/peaklabs_dev' },
      { label: 'Bluesky', href: 'https://bsky.app/profile/peaklabs.dev' },
      { label: 'Mastodon', href: 'https://fosstodon.org/@peaklabs_dev' },
    ],
  },
  {
    name: 'ShadowArcanist',
    role: 'Community Lead, Developer',
    image: '/docs/images/team/shadowarcanist.webp',
    links: [
      { label: 'GitHub', href: 'https://github.com/shadowarcanist' },
      { label: 'Website', href: 'https://shadowarcanist.com' },
      { label: 'X', href: 'https://x.com/shadowarcanist' },
    ],
  },
  {
    name: 'Cynthia Ebert',
    role: 'Developer, Community Moderator',
    image: '/docs/images/team/cinzya.webp',
    links: [
      { label: 'GitHub', href: 'https://github.com/Cinzya' },
      { label: 'Website', href: 'https://cinzya.gg/' },
    ],
  },
  {
    name: 'Aditya Tripathi',
    role: 'Developer, Community Moderator',
    image: '/docs/images/team/aditya.webp',
    links: [
      { label: 'GitHub', href: 'https://github.com/adiologydev' },
      { label: 'Website', href: 'https://adiology.dev' },
      { label: 'X', href: 'https://x.com/AdityaTripathiD' },
    ],
  },
  {
    name: 'You?',
    role: 'Would you be next?',
    image: '',
    links: [],
    variant: 'join',
  },
];

function TeamLinks({ links }: { links: TeamLink[] }) {
  const githubLink = links.find((link) => link.label === 'GitHub');
  const websiteLink = links.find((link) => link.label === 'Website');
  const xLink = links.find((link) => link.label === 'X');
  const visibleLinks = [githubLink, websiteLink ?? xLink].filter(
    (link): link is TeamLink => Boolean(link),
  );

  if (visibleLinks.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2.5">
      {visibleLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          aria-label={link.label}
          className={`team-social-link team-social-link-${link.label.toLowerCase()} ${link.label === 'X' ? 'team-social-link-icon-only' : ''} inline-flex items-center justify-center text-xs font-bold transition-colors`}
          onClick={(event) => event.stopPropagation()}
        >
          <TeamLinkIcon label={link.label} />
          {link.label === 'X' ? null : link.label}
        </a>
      ))}
    </div>
  );
}

function TeamLinkIcon({ label }: { label: string }) {
  if (label === 'GitHub') {
    return (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    );
  }

  if (label === 'Bluesky') {
    return (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden="true">
        <path d="M12 10.8C10.9 8.65 7.91 4.64 5.14 2.67 2.48.77 1.47 1.1.8 1.4.03 1.75 0 2.93 0 3.62c0 .7.38 5.73.63 6.57.82 2.73 3.72 3.66 6.33 3.36-4.56.67-8.6 2.33-3.29 8.22 5.84 6.04 8.02-1.29 8.33-3.66.31 2.37 2.24 9.53 8.33 3.66 5.31-5.89 1.27-7.55-3.29-8.22 2.61.3 5.51-.63 6.33-3.36.25-.84.63-5.87.63-6.57 0-.69-.03-1.87-.8-2.22-.67-.3-1.68-.63-4.34 1.27-2.77 1.97-5.76 5.98-6.86 8.13Z" />
      </svg>
    );
  }

  if (label === 'X') {
    return (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-3" aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.292 19.491h2.039L6.486 3.24H4.298l13.311 17.404Z" />
      </svg>
    );
  }

  return <GlobePointer className="size-3.5" size={14} weight="Filled" aria-hidden="true" />;
}

function ProfileCard({ member }: { member: TeamMember }) {
  const isJoinCard = member.variant === 'join';
  const primaryLink = member.links.find((link) => link.label === 'Website')
    ?? member.links.find((link) => link.label === 'X');

  function openPrimaryLink() {
    if (primaryLink) {
      window.location.href = primaryLink.href;
    }
  }

  return (
    <article
      className={`team-card group flex min-h-72 w-full max-w-[20rem] flex-col items-center justify-center rounded-lg border border-fd-border bg-fd-background/70 p-6 shadow-sm transition duration-200 hover:-translate-y-1 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] ${primaryLink ? 'cursor-pointer' : ''} ${isJoinCard ? 'team-card-join' : ''}`}
      role={primaryLink ? 'link' : undefined}
      tabIndex={primaryLink ? 0 : undefined}
      aria-label={primaryLink ? `${member.name} profile` : member.name}
      onClick={primaryLink ? openPrimaryLink : undefined}
      onKeyDown={
        primaryLink
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPrimaryLink();
              }
            }
          : undefined
      }
    >
      <div className={`flex flex-1 flex-col items-center ${isJoinCard ? 'pt-8' : ''}`}>
        {isJoinCard ? (
          <div className="team-join-icon flex size-24 items-center justify-center rounded-full ring-4 ring-fd-background">
            <UserTick2 className="size-11" size={44} weight="Filled" aria-hidden="true" />
          </div>
        ) : (
          <img
            src={member.image}
            alt={member.name}
            className="size-24 rounded-full object-cover ring-4 ring-fd-background shadow-sm"
          />
        )}
        <h2
          className={`m-0 text-center text-base font-bold tracking-normal text-fd-foreground ${isJoinCard ? 'mt-8' : 'mt-2'}`}
        >
          {member.name}
        </h2>
        <p className="m-0 mt-1 text-center text-sm font-semibold text-fd-muted-foreground">
          {member.role}
        </p>
      </div>
      {member.links.length > 0 ? <TeamLinks links={member.links} /> : <div className="mt-5 h-9" />}
    </article>
  );
}

export function TeamPage() {
  return (
    <div data-team-page className="not-prose mx-auto -mt-6 w-full max-w-6xl">
      <style>
        {`
          article#nd-page:has([data-team-page]) > div.grid.gap-4 {
            display: none;
          }

          [data-team-page] .team-social-link {
            height: 2.25rem;
            width: auto;
            gap: 0.5rem;
            border: 2px solid rgb(255 255 255 / 0.22);
            border-radius: 9999px;
            background: rgb(255 255 255 / 0.04);
            padding-inline: 0.75rem;
            color: rgb(245 245 245);
            box-shadow: 0 0 8px rgb(255 255 255 / 0.045);
          }

          [data-team-page] .team-social-link:hover {
            border-color: rgb(255 255 255 / 0.38);
            background: rgb(255 255 255 / 0.065);
            color: white;
          }

          [data-team-page] .team-social-link-website,
          [data-team-page] .team-social-link-bluesky,
          [data-team-page] .team-social-link-x {
            border-color: rgb(123 140 255 / 0.56);
            background: rgb(88 101 242 / 0.16);
            color: rgb(236 238 255);
            box-shadow:
              0 0 0 1px rgb(88 101 242 / 0.16),
              0 0 12px rgb(88 101 242 / 0.28);
          }

          [data-team-page] .team-social-link-website:hover,
          [data-team-page] .team-social-link-bluesky:hover,
          [data-team-page] .team-social-link-x:hover {
            border-color: rgb(164 174 255 / 0.72);
            background: rgb(88 101 242 / 0.2);
            color: white;
            box-shadow:
              0 0 0 1px rgb(88 101 242 / 0.22),
              0 0 16px rgb(88 101 242 / 0.36);
          }

          [data-team-page] .team-social-link svg {
            flex: none;
          }

          [data-team-page] .team-social-link-icon-only {
            width: 2.25rem;
            padding-inline: 0;
          }

          html:not(.dark) [data-team-page] .team-social-link {
            border-color: rgb(0 0 0 / 0.24);
            background: rgb(0 0 0 / 0.04);
            color: rgb(39 39 42);
            box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
          }

          html:not(.dark) [data-team-page] .team-social-link:hover {
            border-color: rgb(0 0 0 / 0.34);
            background: rgb(0 0 0 / 0.065);
            color: rgb(0 0 0);
          }

          html:not(.dark) [data-team-page] .team-social-link-website,
          html:not(.dark) [data-team-page] .team-social-link-bluesky,
          html:not(.dark) [data-team-page] .team-social-link-x {
            border-color: rgb(88 101 242 / 0.32);
            background: rgb(88 101 242 / 0.16);
            color: #4652d9;
            box-shadow: 0 2px 8px rgb(88 101 242 / 0.12);
          }

          html:not(.dark) [data-team-page] .team-social-link-website:hover,
          html:not(.dark) [data-team-page] .team-social-link-bluesky:hover,
          html:not(.dark) [data-team-page] .team-social-link-x:hover {
            border-color: rgb(88 101 242 / 0.42);
            background: rgb(88 101 242 / 0.22);
            color: #3540bf;
            box-shadow: 0 3px 10px rgb(88 101 242 / 0.16);
          }

          [data-team-page] .team-card {
            background-clip: padding-box;
          }

          [data-team-page] .team-card-join .team-join-icon {
            background:
              linear-gradient(180deg, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.02) 44%, rgb(0 0 0 / 0.1)),
              linear-gradient(135deg, #8b73ff 0%, #6f50e8 48%, #5c38d5 100%);
            color: white;
            box-shadow:
              inset 0 1px 0 rgb(255 255 255 / 0.18),
              inset 0 -1px 0 rgb(0 0 0 / 0.16),
              0 8px 20px rgb(94 62 216 / 0.22);
          }

          [data-team-page] .team-card:hover {
            border-color: transparent;
            background:
              linear-gradient(rgb(10 10 10 / 0.94), rgb(10 10 10 / 0.94)) padding-box,
              linear-gradient(135deg, #9a86ff 0%, #7a5cf0 48%, #6643dd 100%) border-box;
            box-shadow:
              inset 0 1px 0 rgb(255 255 255 / 0.08),
              0 0 0 1px rgb(139 115 255 / 0.14),
              0 12px 28px rgb(94 62 216 / 0.26),
              0 2px 14px rgb(255 255 255 / 0.04);
          }

          html:not(.dark) [data-team-page] .team-card:hover {
            background:
              linear-gradient(rgb(255 255 255 / 0.96), rgb(255 255 255 / 0.96)) padding-box,
              linear-gradient(135deg, #9a86ff 0%, #7a5cf0 48%, #6643dd 100%) border-box;
            box-shadow:
              inset 0 1px 0 rgb(255 255 255 / 0.75),
              0 0 0 1px rgb(139 115 255 / 0.14),
              0 12px 28px rgb(94 62 216 / 0.18),
              0 2px 10px rgb(0 0 0 / 0.06);
          }
        `}
      </style>
      <section className="relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card/55 px-5 py-10 shadow-2xl shadow-black/10 sm:px-8 md:px-10 md:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-border to-transparent" />
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="m-0 text-4xl font-bold tracking-normal text-fd-foreground md:text-5xl">
            Team behind Coolify
          </h1>
          <p className="m-0 mx-auto mt-5 max-w-2xl text-base leading-7 text-fd-muted-foreground md:text-lg">
            A small international team building the product, maintaining the platform,
            improving the docs, and supporting the community around self-hosting.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-5">
          {teamMembers.map((member) => (
            <ProfileCard key={member.name} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
