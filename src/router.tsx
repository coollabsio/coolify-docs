import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { NotFound } from '@/components/pages/not-found';
import { site } from '@/lib/config/site';

export function getRouter() {
  return createTanStackRouter({
    basepath: site.docsBasePath,
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
  });
}
