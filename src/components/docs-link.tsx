import { Link as TanStackLink } from '@tanstack/react-router';
import { forwardRef, type ComponentProps, type MouseEvent } from 'react';

type DocsLinkProps = ComponentProps<'a'> & { prefetch?: boolean };

export const DocsLink = forwardRef<HTMLAnchorElement, DocsLinkProps>(function DocsLink(
  { href = '#', prefetch = true, children, ...props },
  ref,
) {
  if (href.startsWith('#')) {
    const { onClick, ...rest } = props;
    // TanStack Router's scrollRestoration can override the browser's native
    // hash scroll, and native scrolling is skipped when the hash already
    // matches the URL. Re-scroll to the target on the next frame so in-page
    // links (e.g. the table of contents) always reach their section.
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const id = decodeURIComponent(href.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start' });
      });
    };
    return (
      <a ref={ref} href={href} onClick={handleClick} {...rest}>
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
