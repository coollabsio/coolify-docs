import { Link as TanStackLink } from '@tanstack/react-router';
import { forwardRef, type ComponentProps } from 'react';

type DocsLinkProps = ComponentProps<'a'> & { prefetch?: boolean };

export const DocsLink = forwardRef<HTMLAnchorElement, DocsLinkProps>(function DocsLink(
  { href = '#', prefetch = true, children, ...props },
  ref,
) {
  if (href.startsWith('#')) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  }

  const hashIndex = href.indexOf('#');
  if (hashIndex > 0) {
    const pathname = href.slice(0, hashIndex);
    const hash = href.slice(hashIndex + 1);
    return (
      <TanStackLink
        ref={ref}
        to={pathname}
        hash={hash}
        preload={prefetch ? 'intent' : false}
        {...props}
      >
        {children}
      </TanStackLink>
    );
  }

  return (
    <TanStackLink ref={ref} to={href} preload={prefetch ? 'intent' : false} {...props}>
      {children}
    </TanStackLink>
  );
});
