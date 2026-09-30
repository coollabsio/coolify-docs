import { type ImageZoomProps, ImageZoom } from 'fumadocs-ui/components/image-zoom';

export function ZoomImage({ className, alt, ...props }: ImageZoomProps) {
  return (
    <ImageZoom
      alt={alt ?? ''}
      className={['rounded-md border border-fd-border/60', className].filter(Boolean).join(' ')}
      zoomInProps={{
        alt: alt ?? '',
      }}
      {...props}
    />
  );
}
