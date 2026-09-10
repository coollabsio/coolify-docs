'use client';

import {
  ArrowsRight,
  Check,
  Checklist2,
  Mailbox,
  ShieldCheck,
  Warning22,
} from 'reicon-react';
import { CoolActionCard } from '@/components/docs/cool-action-card';
import { CoolActionCardGrid } from '@/components/docs/cool-action-card-grid';
import { CoolCallout } from '@/components/docs/cool-callout';
import { CoolDocsPage, CoolPanel } from '@/components/docs/cool-layout';
import type { CoolIcon } from '@/components/docs/cool-types';

const textLinkClassName = 'font-semibold text-fd-foreground underline decoration-fd-muted-foreground/50 underline-offset-4 hover:text-fd-primary hover:decoration-fd-primary';

const DiscordMark: CoolIcon = ({ className, ...props }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.347-.408.813-.558 1.177a18.27 18.27 0 0 0-5.304 0A12.64 12.64 0 0 0 9.46 3a19.736 19.736 0 0 0-4.438 1.372C2.218 8.537 1.456 12.596 1.838 16.598A19.91 19.91 0 0 0 7.284 19.32a13.443 13.443 0 0 0 1.169-1.907 12.59 12.59 0 0 1-1.844-.88c.155-.114.307-.233.454-.355 3.555 1.64 7.414 1.64 10.927 0 .15.122.302.24.454.355-.593.348-1.21.644-1.844.88.34.66.73 1.296 1.17 1.907a19.88 19.88 0 0 0 5.45-2.722c.456-4.64-.78-8.664-3.903-12.23M8.02 14.176c-1.066 0-1.94-.98-1.94-2.185 0-1.206.857-2.185 1.94-2.185 1.092 0 1.957.988 1.94 2.185 0 1.206-.857 2.185-1.94 2.185m7.14 0c-1.067 0-1.94-.98-1.94-2.185 0-1.206.856-2.185 1.94-2.185 1.091 0 1.956.988 1.939 2.185 0 1.206-.848 2.185-1.94 2.185" />
  </svg>
);

const supportPaths = [
  {
    title: 'Discord community',
    href: 'https://coollabs.io/discord',
    icon: DiscordMark,
    type: 'primary' as const,
    cta: 'Join Discord',
    description: 'Best first stop for most self-hosted questions, setup issues, and troubleshooting.',
    bullets: [
      'Search existing threads before posting',
      'Create a post in the support forum channel',
      'Core team members also watch the forum',
    ],
  },
  {
    title: 'Cloud support',
    href: 'mailto:hi@coollabs.io',
    icon: Mailbox,
    type: 'secondary' as const,
    cta: 'Email support',
    description: 'For Coolify cloud billing related issues and account management.',
    bullets: [
      'Use the email address on your Cloud account',
      'Include your Coolify Cloud account email',
      'Response times can vary because the team is small',
    ],
  },
];

const details = [
  ['Coolify type', 'Self-hosted or Coolify Cloud'],
  ['Version', 'Coolify version and recent update history'],
  ['Exact problem', 'Error message, failing page, command, or deployment step'],
  ['Logs', 'Server, application, deployment, proxy, or database logs'],
  ['What changed', 'Recent DNS, server, update, or configuration changes'],
  ['What you tried', 'Steps you already tried to solve the issue'],
];

const expectations = [
  'Discord support is the fastest path to get support and escalate to core developers when needed.',
  'The core team is small, with fewer than 5 people, so direct support cannot be guaranteed for every single issue.',
  'If a Discord support post needs attention from core developers, Coolify team members can escalate it internally based on the situation.',
];

const supportWorkflows = [
  {
    id: 'discord-support',
    icon: DiscordMark,
    title: 'How Discord support works',
    items: [
      'Search existing posts in the support forum channel before opening a new one.',
      'If nothing matches your issue, create a new support post with as much detail as possible.',
      'Community members and Coolify team members watch the forum and help when they can.',
      'When a post needs attention from core developers, Coolify team members can escalate it internally.',
    ],
  },
  {
    id: 'email-support',
    icon: Mailbox,
    title: 'How email support works',
    items: [
      'Use email support for Coolify Cloud billing and account management issues.',
      'Send the email from the address you used to create your Coolify Cloud account.',
      'Include the account email, a short summary, and any invoice or billing context that helps identify the issue.',
      <>
        Email responses can take longer because only{' '}
        <a href="https://heyandras.dev" className={textLinkClassName}>
          Andras
        </a>{' '}
        and{' '}
        <a href="https://shadowarcanist.com" className={textLinkClassName}>
          ShadowArcanist
        </a>{' '}
        handle the support inbox.
      </>,
    ],
  },
];

export function SupportPage() {
  return (
    <CoolDocsPage data-support-page hideToc>
      <CoolCallout icon={ArrowsRight} title="The short version">
        <p>
          Start with the Discord support forum for most questions. If you use Coolify Cloud or need
          dedicated support for a self-hosted instance, email{' '}
          <a href="mailto:hi@coollabs.io" className={textLinkClassName}>
            hi@coollabs.io
          </a>
          .
        </p>
      </CoolCallout>

      <CoolActionCardGrid>
        {supportPaths.map((path) => (
          <CoolActionCard
            key={path.title}
            href={path.href}
            icon={path.icon}
            title={path.title}
            type={path.type}
            description={path.description}
            bullets={path.bullets}
            btn-cta={path.cta}
          />
        ))}
      </CoolActionCardGrid>

      <CoolCallout icon={Checklist2} title="Before you ask" contentClassName="!p-0">
        <CoolPanel>
          <div>
            <h3 className="m-0 text-sm font-semibold text-fd-foreground">Make it easy to help</h3>
            <p className="m-0 text-sm leading-6 text-fd-muted-foreground">
              Share the useful bits upfront so people do not have to ask for the basics first.
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-fd-border bg-fd-muted/20 p-3">
                <span className="block text-sm font-semibold text-fd-foreground">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-fd-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CoolPanel>
      </CoolCallout>

      <div className="grid gap-4 md:grid-cols-2">
        {supportWorkflows.map((workflow) => (
          <CoolCallout key={workflow.id} icon={workflow.icon} title={workflow.title}>
            <ul className="m-0 space-y-2 p-0">
              {workflow.items.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-fd-foreground" aria-hidden={true} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CoolCallout>
        ))}
      </div>

      <CoolCallout icon={Warning22} title="Support expectations" type="warn">
        <ul className="m-0 space-y-2 p-0">
          {expectations.map((item) => (
            <li key={item} className="flex gap-2">
              <ShieldCheck className="mt-1 size-4 shrink-0 text-fd-foreground" weight="Filled" aria-hidden={true} />
              <span>{item}</span>
            </li>
          ))}
          <li className="flex gap-2">
            <ShieldCheck className="mt-1 size-4 shrink-0 text-fd-foreground" weight="Filled" aria-hidden={true} />
            <span>
              Direct email support may take longer because we receive a lot of emails, and emails are
              handled by only 2 people,{' '}
              <a href="https://heyandras.dev" className={textLinkClassName}>
                Andras
              </a>{' '}
              and{' '}
              <a href="https://shadowarcanist.com" className={textLinkClassName}>
                ShadowArcanist
              </a>
              .
            </span>
          </li>
        </ul>
      </CoolCallout>
    </CoolDocsPage>
  );
}
