import type { ClientApiPageProps } from 'fumadocs-openapi/ui/create-client';
import { createClientAPIPage } from 'fumadocs-openapi/ui/create-client';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiServerSelector } from './api-server-selector';

const RefreshServerContext = createContext<() => void>(() => undefined);

const GeneratedClientAPIPage = createClientAPIPage({
  content: {
    renderOperationLayout: (slots) => <ApiOperationLayout {...slots} />,
  },
});

export function ClientAPIPage(props: ClientApiPageProps) {
  const [revision, setRevision] = useState(0);

  return (
    <RefreshServerContext.Provider value={() => setRevision((value) => value + 1)}>
      <GeneratedClientAPIPage key={revision} {...props} />
    </RefreshServerContext.Provider>
  );
}

function ApiOperationLayout({
  apiExample,
  apiPlayground,
  authSchemes,
  body,
  callbacks,
  description,
  header,
  parameters,
  responses,
}: {
  apiExample: ReactNode;
  apiPlayground: ReactNode;
  authSchemes: ReactNode;
  body: ReactNode;
  callbacks: ReactNode;
  description: ReactNode;
  header: ReactNode;
  parameters: ReactNode;
  responses: ReactNode;
}) {
  const refreshServer = useContext(RefreshServerContext);

  return (
    <div className="flex flex-col gap-x-6 gap-y-4 @4xl:flex-row @4xl:items-start">
      <div className="min-w-0 flex-1">
        {header}
        <div className="not-prose overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground shadow-md">
          <ApiServerSelector onServerChange={refreshServer} />
          <div className="api-playground-shell [&>form]:rounded-none [&>form]:border-0 [&>form]:shadow-none [&>form>button:first-child]:hidden">
            {apiPlayground}
          </div>
        </div>
        {description}
        {authSchemes}
        {parameters}
        {body}
        {responses}
        {callbacks}
      </div>
      <div className="@4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+1rem)] @4xl:w-[400px]">
        {apiExample}
      </div>
    </div>
  );
}
