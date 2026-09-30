import type React from 'react';
import { Check } from 'reicon-react';
import { CoolCallout } from './cool-callout';
import { CoolPanel } from './cool-layout';
import type { CoolIcon } from './cool-types';

type CoolResourceShowcaseProps = {
  description?: React.ReactNode;
  icon: CoolIcon;
  profile: Array<{
    label: React.ReactNode;
    value: React.ReactNode;
  }>;
  resources: Array<{
    description?: React.ReactNode;
    label: React.ReactNode;
    value: React.ReactNode;
  }>;
  supports: React.ReactNode[];
  supportsTitle?: React.ReactNode;
  title: React.ReactNode;
};

export function CoolResourceShowcase({
  description,
  icon,
  profile,
  resources,
  supports,
  supportsTitle = 'This server comfortably supports:',
  title,
}: CoolResourceShowcaseProps) {
  return (
    <CoolCallout contentClassName="!p-0" icon={icon} title={title}>
      {description ? (
        <CoolPanel>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{description}</p>
        </CoolPanel>
      ) : null}
      <div className="grid gap-0 border-t border-fd-border lg:grid-cols-[0.9fr_1.1fr]">
        <CoolPanel className="border-b border-fd-border lg:border-b-0 lg:border-e">
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.map((item) => (
              <div
                key={String(item.label)}
                className="rounded-lg border border-fd-border bg-fd-muted/20 p-3"
              >
                <p className="m-0 text-xs leading-5 text-fd-muted-foreground">{item.label}</p>
                <p className="m-0 mt-1 text-sm font-semibold text-fd-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            {resources.map((item) => (
              <div
                key={String(item.label)}
                className="rounded-lg border border-fd-border bg-fd-muted/20 p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-fd-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-fd-foreground">{item.value}</span>
                </div>
                {item.description ? (
                  <p className="m-0 mt-1 text-xs leading-5 text-fd-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </CoolPanel>

        <CoolPanel>
          <h3 className="m-0 text-sm font-semibold text-fd-foreground">{supportsTitle}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {supports.map((item, index) => (
              <div key={index} className="flex gap-2 text-sm leading-6 text-fd-muted-foreground">
                <Check className="mt-1 size-4 shrink-0 text-fd-foreground" aria-hidden={true} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CoolPanel>
      </div>
    </CoolCallout>
  );
}
