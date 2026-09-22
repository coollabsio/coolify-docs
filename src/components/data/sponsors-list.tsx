'use client';

import { useEffect, useMemo, useState } from 'react';
import { SPONSORS_URL, type Sponsor, type SponsorsResponse } from '@/lib/config/sponsors';

const ref = 'coolify.io';
function addRef(url: string): string {
  return url.includes('?') ? `${url}&ref=${ref}&utm_source=${ref}` : `${url}?ref=${ref}&utm_source=${ref}`;
}

function sponsorImageUrl(sponsor: Sponsor): string | undefined {
  return sponsor.docsImageUrl ?? sponsor.image?.docs?.url ?? sponsor.imageUrl ?? sponsor.image?.url;
}

function SponsorCard({ sponsor, size }: { sponsor: Sponsor; size: 'huge' | 'big' }) {
  const imageUrl = sponsorImageUrl(sponsor);
  const logoWellClass =
    'sponsor-logo-well flex w-full items-center justify-center border-b border-white/10 bg-neutral-950 shadow-inner shadow-black/30';

  if (size === 'huge') {
    return (
      <a
        href={addRef(sponsor.url)}
        className="sponsor-card sponsor-card-huge group flex min-h-80 w-full flex-col items-stretch justify-start overflow-hidden rounded-lg border border-fd-border bg-fd-background/80 p-0 text-center no-underline shadow-sm transition duration-200 hover:-translate-y-1"
        target="_blank"
        rel="noreferrer noopener"
      >
        <div className="flex min-h-80 w-full flex-1 flex-col items-stretch">
          <div className={`${logoWellClass} h-40 shrink-0 px-8`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${sponsor.name} logo`}
                className="max-h-28 max-w-72 object-contain"
              />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-8 pb-8 pt-6">
            <p className="m-0 text-lg font-bold text-fd-foreground">{sponsor.name}</p>
            <p className="m-0 mx-auto mt-3 max-w-72 break-words [overflow-wrap:anywhere] line-clamp-3 text-sm leading-6 text-fd-muted-foreground">
              {sponsor.description}
            </p>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={addRef(sponsor.url)}
      className="sponsor-card group flex min-h-52 w-full flex-col items-stretch justify-start overflow-hidden rounded-lg border border-fd-border bg-fd-background/70 p-0 text-center no-underline shadow-sm transition duration-200 hover:-translate-y-1"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="flex min-h-52 w-full min-w-0 flex-1 flex-col items-stretch">
        <div className={`${logoWellClass} h-28 shrink-0 px-5`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${sponsor.name} logo`}
              className="max-h-20 max-w-48 object-contain"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-5 pb-5 pt-4">
          <p className="m-0 text-base font-bold text-fd-foreground">{sponsor.name}</p>
          <p className="m-0 mx-auto mt-2 max-w-64 break-words [overflow-wrap:anywhere] line-clamp-2 text-sm leading-6 text-fd-muted-foreground">
            {sponsor.description}
          </p>
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
      <div className="mt-12 rounded-lg border border-fd-border bg-fd-background/70 p-5 text-center text-sm text-fd-muted-foreground">
        Could not load sponsors. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-12 rounded-lg border border-fd-border bg-fd-background/70 p-5 text-center text-sm text-fd-muted-foreground">
        Loading sponsors…
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-10">
      <style>
        {`
          [data-sponsors-page] .sponsor-card {
            background-clip: padding-box;
          }

          [data-sponsors-page] .sponsor-card-huge {
            box-shadow:
              inset 0 1px 0 rgb(255 255 255 / 0.04),
              0 10px 24px rgb(0 0 0 / 0.08);
          }

          [data-sponsors-page] .sponsor-card-huge img {
            filter: drop-shadow(0 8px 18px rgb(0 0 0 / 0.12));
          }

          [data-sponsors-page] .sponsor-logo-well {
            background:
              radial-gradient(circle at top, rgb(39 39 42 / 0.96), rgb(9 9 11 / 0.98) 64%);
          }

          [data-sponsors-page] .sponsor-card:hover {
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

          html:not(.dark) [data-sponsors-page] .sponsor-card:hover {
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
      {hugeSponsors.length > 0 ? (
        <section>
          <h2 className="m-0 text-center text-xl font-bold tracking-normal text-fd-foreground">
            Huge Sponsors
          </h2>
          <div className="mx-auto mt-5 grid max-w-5xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {hugeSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} size="huge" />
            ))}
          </div>
        </section>
      ) : null}

      {bigSponsors.length > 0 ? (
        <section className="border-t border-fd-border/70 pt-10">
          <h2 className="m-0 text-center text-xl font-bold tracking-normal text-fd-foreground">
            Big Sponsors
          </h2>
          <div className="mx-auto mt-5 grid max-w-5xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {bigSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} size="big" />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
