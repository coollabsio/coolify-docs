import type React from 'react';
import { CoolCallout } from './cool-callout';
import { renderCoolInlineContent } from './cool-inline-content';
import type { CoolIcon } from './cool-types';

type CoolFlowProps = {
  description: React.ReactNode;
  endnote?: React.ReactNode;
  icon: CoolIcon;
  id: string;
  list?: React.ReactNode[];
  result?: React.ReactNode;
  steps: React.ReactNode[];
  title: string;
};

export function CoolFlow({ description, endnote, icon, id, list = [], result, steps, title }: CoolFlowProps) {
  const finalNote = endnote ?? result;

  return (
    <div id={id} className="not-prose my-5 scroll-mt-24">
      <CoolCallout data-cool-docs className="my-0 overflow-hidden" contentClassName="!p-0" icon={icon} title={title}>
        <div className="p-4 sm:p-5">
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{renderCoolInlineContent(description)}</p>
        </div>
        <div className="grid gap-0 border-t border-fd-border lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-fd-border p-4 lg:border-b-0 lg:border-e sm:p-5">
            <div className="space-y-0">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-3 pb-5 last:pb-0">
                  {index < steps.length - 1 ? (
                    <span className="absolute left-[0.8125rem] top-7 h-[calc(100%-1.75rem)] w-px bg-fd-border" aria-hidden={true} />
                  ) : null}
                  <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-fd-border bg-fd-background text-xs font-semibold text-fd-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="m-0 text-sm font-semibold leading-6 text-fd-foreground">{renderCoolInlineContent(step)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <ul className="m-0 list-disc space-y-2 ps-5 text-sm leading-6 text-fd-muted-foreground [&_a]:font-semibold [&_a]:text-fd-foreground [&_a]:underline [&_a]:decoration-fd-primary [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-fd-primary/70">
              {list.map((item, index) => (
                <li key={index} className="ps-1">{renderCoolInlineContent(item)}</li>
              ))}
            </ul>
            {finalNote ? <p className="m-0 mt-5 text-sm leading-6 text-fd-muted-foreground">{renderCoolInlineContent(finalNote)}</p> : null}
          </div>
        </div>
      </CoolCallout>
    </div>
  );
}
