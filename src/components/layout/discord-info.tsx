'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/ui/cn';

const discordInviteCode = 'ka4bNH8TMU';
const discordInviteUrl = 'https://coollabs.io/discord';

type DiscordInviteResponse = {
  approximate_member_count?: number;
  guild?: {
    name?: string;
  };
};

export function DiscordInfo({ className }: { className?: string }) {
  const [serverName, setServerName] = useState('Discord');
  const [memberCount, setMemberCount] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    async function loadDiscordInfo() {
      try {
        const response = await fetch(`https://discord.com/api/v9/invites/${discordInviteCode}?with_counts=true`, {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as DiscordInviteResponse;
        setServerName(data.guild?.name ?? 'Discord');

        if (typeof data.approximate_member_count === 'number') {
          setMemberCount(humanizeNumber(data.approximate_member_count));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setMemberCount(undefined);
        }
      }
    }

    void loadDiscordInfo();

    return () => controller.abort();
  }, []);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-current transition-colors',
        className,
      )}
      title={memberCount ? `${serverName}: ${memberCount} members` : serverName}
    >
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.347-.408.813-.558 1.177a18.27 18.27 0 0 0-5.304 0A12.64 12.64 0 0 0 9.46 3a19.736 19.736 0 0 0-4.438 1.372C2.218 8.537 1.456 12.596 1.838 16.598A19.91 19.91 0 0 0 7.284 19.32a13.443 13.443 0 0 0 1.169-1.907 12.59 12.59 0 0 1-1.844-.88c.155-.114.307-.233.454-.355 3.555 1.64 7.414 1.64 10.927 0 .15.122.302.24.454.355-.593.348-1.21.644-1.844.88.34.66.73 1.296 1.17 1.907a19.88 19.88 0 0 0 5.45-2.722c.456-4.64-.78-8.664-3.903-12.23M8.02 14.176c-1.066 0-1.94-.98-1.94-2.185 0-1.206.857-2.185 1.94-2.185 1.092 0 1.957.988 1.94 2.185 0 1.206-.857 2.185-1.94 2.185m7.14 0c-1.067 0-1.94-.98-1.94-2.185 0-1.206.856-2.185 1.94-2.185 1.091 0 1.956.988 1.939 2.185 0 1.206-.848 2.185-1.94 2.185" />
      </svg>
      {memberCount ? <span className="text-xs font-bold">{memberCount}</span> : null}
    </span>
  );
}

export function getDiscordInviteUrl() {
  return discordInviteUrl;
}

function humanizeNumber(num: number): string {
  if (num < 1000) return num.toString();

  if (num < 100000) {
    const value = (num / 1000).toFixed(1);
    return `${value.endsWith('.0') ? value.slice(0, -2) : value}K`;
  }

  if (num < 1000000) return `${Math.floor(num / 1000)}K`;

  return num.toString();
}
