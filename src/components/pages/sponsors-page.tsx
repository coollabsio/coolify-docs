import { SponsorsList } from '@/components/data/sponsors-list';

export function SponsorsPage() {
  return (
    <div data-sponsors-page className="not-prose mx-auto -mt-6 w-full max-w-6xl">
      <style>
        {`
          article#nd-page:has([data-sponsors-page]) > div.grid.gap-4 {
            display: none;
          }
        `}
      </style>
      <section className="relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card/55 px-5 py-10 shadow-2xl shadow-black/10 sm:px-8 md:px-10 md:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-border to-transparent" />
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="m-0 text-4xl font-bold tracking-normal text-fd-foreground md:text-5xl">
            Sponsors Supporting Coolify
          </h1>
          <p className="m-0 mx-auto mt-5 max-w-2xl text-base leading-7 text-fd-muted-foreground md:text-lg">
            Companies and organizations supporting Coolify development, infrastructure,
            hosting, and the open-source ecosystem around self-hosting.
          </p>
        </div>

        <SponsorsList />
      </section>
    </div>
  );
}
