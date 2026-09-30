import { Cloud, Pencil, Server, ShieldAlert, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/ui/cn';

const CLOUD_URL = 'https://app.coolify.io/api/v1';
const DEFAULT_SELF_HOSTED_URL = 'https://coolify.example.com';
const STORAGE_KEY = 'fumadocs-openapi-server-url';

type ServerMode = 'cloud' | 'self-hosted';

type StoredServer = {
  name?: string;
  url?: string;
  variables?: Record<string, string>;
};

function getStoredSelection() {
  if (typeof window === 'undefined') {
    return { mode: 'cloud' as const, selfHostedUrl: DEFAULT_SELF_HOSTED_URL };
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as StoredServer | null;
    if (stored?.url === '{protocol}://{domain}/api/v1') {
      const protocol = stored.variables?.protocol ?? 'https';
      const domain = stored.variables?.domain ?? 'coolify.example.com';
      return { mode: 'self-hosted' as const, selfHostedUrl: `${protocol}://${domain}` };
    }
  } catch {
    // Ignore invalid values left by an older playground version.
  }

  return { mode: 'cloud' as const, selfHostedUrl: DEFAULT_SELF_HOSTED_URL };
}

function parseSelfHostedUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.pathname !== '/' && url.pathname !== '' && url.pathname !== '/api/v1') return null;

    return {
      displayUrl: `${url.protocol}//${url.host}`,
      protocol: url.protocol.slice(0, -1),
      domain: url.host,
    };
  } catch {
    return null;
  }
}

function saveSelection(mode: ServerMode, selfHostedUrl: string) {
  if (mode === 'cloud') {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: 'Coolify Cloud', url: CLOUD_URL, variables: {} }),
    );
    return true;
  }

  const parsed = parseSelfHostedUrl(selfHostedUrl);
  if (!parsed) return false;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      name: 'Self-hosted',
      url: '{protocol}://{domain}/api/v1',
      variables: { protocol: parsed.protocol, domain: parsed.domain },
    }),
  );
  return true;
}

export function ApiServerSelector({ onServerChange }: { onServerChange: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputId = useId();
  const [mode, setMode] = useState<ServerMode>('cloud');
  const [currentMode, setCurrentMode] = useState<ServerMode>('cloud');
  const [selfHostedUrl, setSelfHostedUrl] = useState(DEFAULT_SELF_HOSTED_URL);
  const [currentUrl, setCurrentUrl] = useState(CLOUD_URL);
  const [error, setError] = useState('');

  useEffect(() => {
    const selection = getStoredSelection();
    setMode(selection.mode);
    setCurrentMode(selection.mode);
    setSelfHostedUrl(selection.selfHostedUrl);
    setCurrentUrl(
      selection.mode === 'cloud' ? CLOUD_URL : `${selection.selfHostedUrl.replace(/\/$/, '')}/api/v1`,
    );
  }, []);

  function openDialog() {
    const selection = getStoredSelection();
    setMode(selection.mode);
    setSelfHostedUrl(selection.selfHostedUrl);
    setError('');
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function applyServer() {
    if (!saveSelection(mode, selfHostedUrl)) {
      setError('Enter a complete URL beginning with https:// or http://.');
      return;
    }

    const parsed = mode === 'self-hosted' ? parseSelfHostedUrl(selfHostedUrl) : null;
    setCurrentMode(mode);
    setCurrentUrl(mode === 'cloud' ? CLOUD_URL : `${parsed?.displayUrl}/api/v1`);
    closeDialog();
    onServerChange();
  }

  const preview =
    mode === 'cloud'
      ? CLOUD_URL
      : parseSelfHostedUrl(selfHostedUrl)
        ? `${parseSelfHostedUrl(selfHostedUrl)?.displayUrl}/api/v1`
        : 'Enter a valid Coolify URL';
  const CurrentServerIcon = currentMode === 'cloud' ? Cloud : Server;

  return (
    <>
      <div className="flex items-center gap-3 border-b bg-fd-muted/20 px-3 py-2.5 text-sm text-fd-card-foreground">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <CurrentServerIcon className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <p className="shrink-0 text-xs font-medium text-fd-muted-foreground">API server</p>
            <code className="block truncate text-[0.8125rem] font-medium">{currentUrl}</code>
          </div>
        </div>
        <button
          type="button"
          onClick={openDialog}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-fd-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Change server
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="api-server-dialog-title"
        className="m-auto w-[min(92vw,34rem)] rounded-xl border bg-fd-background p-0 text-fd-foreground shadow-2xl backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="api-server-dialog-title" className="text-lg font-semibold">
                Choose where to send API requests
              </h2>
              <p className="mt-1 text-sm text-fd-muted-foreground">
                This changes the request URL and code examples on every endpoint page.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close"
              className="rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">API server type</legend>
            <ServerOption
              checked={mode === 'cloud'}
              description="Use the managed API at app.coolify.io."
              icon={<Cloud className="size-5" aria-hidden="true" />}
              label="Coolify Cloud"
              onChange={() => {
                setMode('cloud');
                setError('');
              }}
            />
            <ServerOption
              checked={mode === 'self-hosted'}
              description="Connect to your own Coolify installation."
              icon={<Server className="size-5" aria-hidden="true" />}
              label="Self-hosted"
              onChange={() => {
                setMode('self-hosted');
                setError('');
              }}
            />
          </fieldset>

          {mode === 'self-hosted' ? (
            <div className="mt-5">
              <label htmlFor={inputId} className="text-sm font-medium">
                Coolify URL
              </label>
              <input
                id={inputId}
                type="url"
                value={selfHostedUrl}
                onChange={(event) => {
                  setSelfHostedUrl(event.target.value);
                  setError('');
                }}
                placeholder="https://coolify.example.com"
                aria-invalid={Boolean(error)}
                aria-describedby={`${inputId}-help ${inputId}-error`}
                className={cn(
                  'mt-2 w-full rounded-lg border bg-fd-background px-3 py-2 font-mono text-sm outline-none transition-shadow focus:ring-2 focus:ring-fd-ring',
                  error && 'border-red-500',
                )}
              />
              <p id={`${inputId}-help`} className="mt-1.5 text-xs text-fd-muted-foreground">
                Enter the URL you use to open Coolify. We add <code>/api/v1</code> automatically.
              </p>
              <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          ) : null}

          <div className="mt-5 rounded-lg border bg-fd-muted/45 p-3">
            <p className="text-xs font-medium text-fd-muted-foreground">Requests will use</p>
            <code className="mt-1 block break-all text-sm">{preview}</code>
          </div>

          <div className="mt-4 flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-fd-muted-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <p>Use only a Coolify URL you trust. Sending a test request also sends the API token you enter.</p>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyServer}
              className="api-server-primary-button rounded-md px-3 py-2 text-sm font-medium text-white focus-visible:outline-none"
            >
              Use this server
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

function ServerOption({
  checked,
  description,
  icon,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  icon: React.ReactNode;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        'cursor-pointer rounded-lg border p-3 transition duration-200 hover:-translate-y-0.5',
        checked ? 'api-server-option-selected' : 'border-fd-border hover:bg-fd-accent/50',
      )}
    >
      <input type="radio" name="api-server" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex items-center gap-2 font-medium">
        <span className={checked ? 'text-fd-primary' : 'text-fd-muted-foreground'}>{icon}</span>
        {label}
      </span>
      <span className="mt-1.5 block text-xs leading-relaxed text-fd-muted-foreground">{description}</span>
    </label>
  );
}
