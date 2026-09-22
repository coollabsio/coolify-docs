'use client';

import { create } from '@orama/orama';
import type { ComponentProps } from 'react';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
  useSearch,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { Search3 } from 'reicon-react';
import { cn } from '@/lib/ui/cn';
import { site } from '@/lib/config/site';

function initOrama() {
  return create({
    schema: { _: 'string' },
    language: 'english',
  });
}

export default function LocalSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: site.searchApi,
    initOrama,
    locale,
  });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIconWithReicon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}

function SearchDialogIconWithReicon({ className, ...props }: ComponentProps<typeof Search3>) {
  const { isLoading } = useSearch();

  return (
    <Search3
      {...props}
      className={cn('size-5 text-fd-muted-foreground', isLoading && 'animate-pulse duration-400', className)}
      weight="Filled"
      aria-hidden="true"
    />
  );
}
