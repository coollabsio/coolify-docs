'use client';

import Link from 'fumadocs-core/link';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import type { CoolIcon } from '@/components/docs/cool-types';

type MediaCardProps = {
  title: string;
  description?: string;
  href?: string;
} & ({ imageSrc: string; imageAlt?: string } | { icon: CoolIcon });

export function MediaCard(props: MediaCardProps) {
  const { title, description, href } = props;
  const visual =
    'imageSrc' in props ? (
      href ? (
        <MediaImage imageSrc={props.imageSrc} imageAlt={props.imageAlt ?? title} />
      ) : (
        <ImageZoom src={props.imageSrc} alt={props.imageAlt ?? title}>
          <MediaImage imageSrc={props.imageSrc} imageAlt={props.imageAlt ?? title} zoomable />
        </ImageZoom>
      )
    ) : (
      <MediaIcon icon={props.icon} />
    );

  const content = (
    <>
      {visual}
      <div className="px-4 py-3">
        <h2 className="not-prose !m-0 text-base font-medium">{title}</h2>
        {description ? <p className="my-0! mt-1 text-sm text-fd-muted-foreground">{description}</p> : null}
      </div>
    </>
  );

  const className =
    'method-card method-card-primary block overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground no-underline! transition duration-200 hover:-translate-y-1';

  if (href) {
    return (
      <Link href={href} data-card className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div data-card className={className}>
      {content}
    </div>
  );
}

function MediaIcon({ icon: Icon }: { icon: CoolIcon }) {
  return (
    <div className="not-prose flex aspect-video items-center justify-center bg-white dark:bg-fd-muted/20">
      <span className="flex size-16 items-center justify-center rounded-xl border border-fd-border bg-fd-background/70 text-fd-foreground shadow-sm">
        <Icon className="size-8" weight="Filled" aria-hidden={true} />
      </span>
    </div>
  );
}

function MediaImage({
  imageSrc,
  imageAlt,
  zoomable,
}: {
  imageSrc: string;
  imageAlt: string;
  zoomable?: boolean;
}) {
  return (
    // biome-ignore lint/performance/noImgElement: static export
    <img
      src={imageSrc}
      alt={imageAlt}
      className={['not-prose !m-0 block aspect-video w-full object-cover', zoomable ? 'cursor-zoom-in' : '']
        .filter(Boolean)
        .join(' ')}
    />
  );
}
