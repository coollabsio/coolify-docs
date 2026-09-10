import type { SerializedPageTree } from 'fumadocs-core/source/client';
import type { ClientApiPageProps } from 'fumadocs-openapi/ui/create-client';

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

type BaseLoaderData = {
  description: string;
  isIndex: boolean;
  ogImagePath: string;
  pageTree: SerializedPageTree;
  title: string;
  url: string;
};

export type DocsLoaderData = BaseLoaderData & {
  type: 'docs';
  markdownUrl: string;
  path: string;
};

export type OpenAPILoaderData = BaseLoaderData & {
  type: 'openapi';
  props: ClientApiPageProps;
};

export type LoaderData = DocsLoaderData | OpenAPILoaderData;

export type DocsManifest = {
  pageTree: SerializedPageTree;
  pages: Record<string, DistributiveOmit<LoaderData, 'pageTree'>>;
};

export function getManifestKey(slugs: string[]) {
  return slugs.join('/');
}
