'use client';

import { useEffect, useMemo, useState } from 'react';
import { SPONSORS_URL, type Sponsor, type SponsorsResponse } from '@/lib/sponsors';

const ref = 'coolify.io';
function addRef(url: string): string {
  return url.includes('?') ? `${url}&ref=${ref}&utm_source=${ref}` : `${url}?ref=${ref}&utm_source=${ref}`;
}

function sponsorImageUrl(sponsor: Sponsor): string | undefined {
  return sponsor.docsImageUrl ?? sponsor.imageUrl;
}

function SponsorCard({ sponsor, size }: { sponsor: Sponsor; size: 'huge' | 'big' }) {
  const imageUrl = sponsorImageUrl(sponsor);

  if (size === 'huge') {
    return (
      <a
        href={addRef(sponsor.url)}
        className="rounded-lg border border-fd-border bg-fd-card p-6 no-underline transition hover:border-fd-primary/60 hover:bg-fd-muted/40"
        target="_blank"
        rel="noreferrer noopener"
      >
        <div className="flex h-full min-h-56 flex-col items-center justify-center gap-5 text-center">
          {imageUrl ? (
            <div className="flex h-20 w-full items-center justify-center">
              <img src={imageUrl} alt={`${sponsor.name} logo`} className="max-h-20 w-full max-w-56 object-contain" />
            </div>
          ) : null}
          <div className="min-w-0">
            <p className="m-0 font-semibold text-fd-foreground">{sponsor.name}</p>
            <p className="m-0 mt-2 line-clamp-3 text-sm leading-6 text-fd-muted-foreground">{sponsor.description}</p>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={addRef(sponsor.url)}
      className="rounded-lg border border-fd-border bg-fd-card p-4 no-underline transition hover:border-fd-primary/60 hover:bg-fd-muted/40"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="flex min-w-0 items-center gap-4">
        {imageUrl ? <img src={imageUrl} alt={`${sponsor.name} logo`} className="size-14 shrink-0 rounded-md object-contain" /> : null}
        <div className="min-w-0">
          <p className="m-0 font-semibold text-fd-foreground">{sponsor.name}</p>
          <p className="m-0 mt-1 line-clamp-3 text-sm leading-6 text-fd-muted-foreground">{sponsor.description}</p>
        </div>
      </div>
    </a>
  );
}

export function SponsorsList() {
  const [data, setData] = useState<SponsorsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(SPONSORS_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch sponsors: ${response.status}`);
        }

        return response.json() as Promise<SponsorsResponse>;
      })
      .then(setData)
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch sponsors');
      });

    return () => controller.abort();
  }, []);

  const hugeSponsors = useMemo(() => data?.tiers.huge ?? [], [data]);
  const bigSponsors = useMemo(() => data?.tiers.big ?? [], [data]);

  if (error) {
    return (
      <div className="not-prose rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-muted-foreground">
        Could not load sponsors. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="not-prose rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-muted-foreground">
        Loading sponsors…
      </div>
    );
  }

  return (
    <div className="not-prose space-y-10">
      {hugeSponsors.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-fd-foreground">Huge Sponsors</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {hugeSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} size="huge" />
            ))}
          </div>
        </section>
      ) : null}

      {bigSponsors.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-fd-foreground">Big Sponsors</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {bigSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} size="big" />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
