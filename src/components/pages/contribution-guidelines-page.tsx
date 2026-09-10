import { Children, Fragment } from 'react';
import type { ReactNode } from 'react';
import { CoolDocsPage } from '@/components/docs/cool-layout';

function SectionDivider() {
  return <div className="h-px bg-fd-border" aria-hidden={true} />;
}

function getSections(children?: ReactNode) {
  return Children.toArray(children).filter((child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }

    return true;
  });
}

function SectionGroup({ sections }: { sections: ReactNode[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <Fragment key={index}>
          {index > 0 ? <SectionDivider /> : null}
          {section}
        </Fragment>
      ))}
    </>
  );
}

export function ContributionGuidelinesPage({ children }: { children?: ReactNode }) {
  const sections = getSections(children);
  const [introSection, ...contentSections] = sections;

  return (
    <CoolDocsPage data-contribution-guidelines-page hideToc>
      {introSection ? (
        <>
          {introSection}
          <SectionDivider />
        </>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-fd-border bg-fd-background/70 p-4">
          <p className="m-0 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">Project scale</p>
          <p className="m-0 mt-2 text-2xl font-semibold text-fd-foreground">470K+</p>
          <p className="m-0 mt-1 text-sm leading-6 text-fd-muted-foreground">people use Coolify worldwide.</p>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background/70 p-4">
          <p className="m-0 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">Review capacity</p>
          <p className="m-0 mt-2 text-2xl font-semibold text-fd-foreground">2 core maintainers</p>
          <p className="m-0 mt-1 text-sm leading-6 text-fd-muted-foreground">actively maintain the project.</p>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background/70 p-4">
          <p className="m-0 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">Current focus</p>
          <p className="m-0 mt-2 text-2xl font-semibold text-fd-foreground">v4 stability</p>
          <p className="m-0 mt-1 text-sm leading-6 text-fd-muted-foreground">major changes are not planned for v4.</p>
        </div>
      </section>

      <SectionDivider />

      <SectionGroup sections={contentSections} />
    </CoolDocsPage>
  );
}
