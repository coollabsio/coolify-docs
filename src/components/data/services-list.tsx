'use client';

import { useMemo, useState } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { SearchIcon } from 'lucide-react';
import services from '../../generated/services.json';

type Service = {
  name: string;
  slug: string;
  description: string;
  category: string;
  logo?: string;
};

const serviceList = services as Service[];
const reportUrl = 'https://github.com/coollabsio/coolify/issues/';

export function ServicesList() {
  const [search, setSearch] = useState('');
  const searchTerm = search.trim().toLowerCase();

  const filteredServices = useMemo(() => {
    if (!searchTerm) return serviceList;

    return serviceList.filter((service) =>
      [service.name, service.description, service.category].some((value) => value.toLowerCase().includes(searchTerm)),
    );
  }, [searchTerm]);

  const categories = useMemo(
    () =>
      Array.from(new Set(filteredServices.map((service) => service.category))).sort((a, b) => a.localeCompare(b)),
    [filteredServices],
  );

  return (
    <div className="not-prose my-8 space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search services</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search services..."
            className="h-9 w-full rounded-lg border border-fd-border bg-fd-card pl-9 pr-3 text-sm text-fd-foreground outline-none transition-colors placeholder:text-fd-muted-foreground focus:border-fd-primary focus:ring-2 focus:ring-fd-ring/20"
          />
        </label>
        <a
          href={reportUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`${buttonVariants({ color: 'secondary', size: 'sm' })} h-9 gap-2 sm:flex-none`}
        >
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Report broken service
        </a>
      </div>

      {filteredServices.length === 0 ? (
        <div className="rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-muted-foreground">
          No services found.
        </div>
      ) : null}

      {categories.map((category) => {
        const items = filteredServices
          .filter((service) => service.category === category)
          .sort((a, b) => a.name.localeCompare(b.name));

        return (
          <section key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-fd-foreground">{category}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <a
                  key={service.slug}
                  href={`/docs/services/${service.slug}`}
                  className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
                >
                  <div className="flex items-start gap-3">
                    {service.logo ? (
                      <img src={service.logo} alt="" className="mt-1 size-8 rounded object-contain" loading="lazy" />
                    ) : null}
                    <div className="min-w-0">
                      <h3 className="font-medium text-fd-foreground">{service.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-fd-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
