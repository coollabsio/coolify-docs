'use client';

import { useState, useEffect } from 'react';

export function OneClickDeploy() {
  const [isOpen, setIsOpen] = useState(false);
  const [serverType, setServerType] = useState<'cloud' | 'self-hosted'>('cloud');
  const [serverUrl, setServerUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [environmentName, setEnvironmentName] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDeploy = () => {
    const baseUrl = serverType === 'cloud' ? 'https://app.coolify.io' : serverUrl;
    const payload = {
        projectName,
        environmentName
    }
    const redirectUrl = `${baseUrl}/deploy?payload=${btoa(JSON.stringify(payload))}`;
    window.location.href = redirectUrl;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
            <img 
                src="/images/cool-deploy.png" 
                alt="Deploy to Coolify" 
                style={{ width: '182px', height: '65px' }}
            />
        </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="relative w-full max-w-md rounded-xl border bg-card dark:bg-black bg-white text-card-foreground shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col space-y-1.5 p-4">
                <h3 className="font-semibold tracking-tight text-2xl ml-2">Deploy to Coolify</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label htmlFor="serverType" className="block text-sm font-medium text-muted-foreground">
                  Server
                </label>
                <select
                  id="serverType"
                  value={serverType}
                  onChange={(e) => setServerType(e.target.value as 'cloud' | 'self-hosted')}
                  className="mt-1 block w-full rounded-lg border-input bg-black/10 dark:bg-white/5 px-2 py-2 text-sm shadow-sm"
                >
                  <option value="cloud">Coolify Cloud</option>
                  <option value="self-hosted">Self-hosted</option>
                </select>
              </div>

              {serverType === 'self-hosted' && (
                <div>
                  <label htmlFor="serverUrl" className="block text-sm font-medium text-muted-foreground">
                    Server URL
                  </label>
                  <input
                    type="text"
                    id="serverUrl"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="https://coolify.example.com"
                    className="mt-1 block w-full rounded-lg border-input bg-black/10 dark:bg-white/5 px-3 py-2 text-sm shadow-sm"
                  />
                </div>
              )}

              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-muted-foreground">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="mt-1 block w-full rounded-lg border-input bg-black/10 dark:bg-white/5 px-3 py-2 text-sm shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="environmentName" className="block text-sm font-medium text-muted-foreground">
                  Environment Name
                </label>
                <input
                  type="text"
                  id="environmentName"
                  value={environmentName}
                  onChange={(e) => setEnvironmentName(e.target.value)}
                  placeholder="production"
                  className="mt-1 block w-full rounded-lg border-input bg-black/10 dark:bg-white/5 px-3 py-2 text-sm shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end p-6 pt-0 space-x-2">
                <button
                    onClick={() => setIsOpen(false)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 p-2 border rounded-lg bg-fd-card cursor-pointer text-fd-foreground text-base h-[42px]"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDeploy}
                    className="w-full md:w-auto flex items-center justify-center gap-2 p-2 px-4 rounded-lg bg-fd-primary text-fd-primary-foreground dark:bg-purple-700 no-underline text-base h-[42px]"
                >
                    Deploy
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}