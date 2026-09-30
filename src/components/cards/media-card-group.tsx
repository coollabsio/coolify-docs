import type { ReactNode } from 'react';

interface MediaCardGroupProps {
  children: ReactNode;
  columns?: 2 | 3;
}

export function MediaCardGroup({ children, columns = 2 }: MediaCardGroupProps) {
  return (
    <div
      data-cool-docs
      className={`mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''}`}
    >
      {children}
    </div>
  );
}
