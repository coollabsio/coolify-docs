'use client';

import { useEffect, useRef, useState } from 'react';

const carbonCode = 'CW7IPKJJ';
const carbonPlacement = 'coolifyio';

function pruneCarbonAds(container: HTMLDivElement) {
  const ads = Array.from(container.querySelectorAll<HTMLElement>('[id^="carbonads"]'));

  for (const ad of ads.slice(1)) {
    ad.remove();
  }
}

export function CarbonAds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAd, setHasAd] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.offsetParent === null) return;
    const target = container;

    target.innerHTML = '';
    setHasAd(false);
    setIsBlocked(false);

    function syncAdState() {
      const hasCarbonAd = target.querySelector('[id^="carbonads"]') !== null;
      setHasAd(hasCarbonAd);

      if (hasCarbonAd) {
        setIsBlocked(false);
      }
    }

    const observer = new MutationObserver(() => {
      pruneCarbonAds(target);
      syncAdState();
    });

    observer.observe(target, { childList: true, subtree: true });

    const fallbackTimer = window.setTimeout(() => {
      if (target.querySelector('[id^="carbonads"]') === null) {
        setIsBlocked(true);
      }
    }, 2500);

    const script = document.createElement('script');
    script.async = true;
    script.id = '_carbonads_js';
    script.onerror = () => {
      window.clearTimeout(fallbackTimer);
      setIsBlocked(true);
    };
    script.src = `https://cdn.carbonads.com/carbon.js?serve=${carbonCode}&placement=${carbonPlacement}`;
    script.type = 'text/javascript';

    target.appendChild(script);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
      target.innerHTML = '';
    };
  }, []);

  return (
    <aside className="carbon-ads max-xl:hidden" aria-label="Advertisement">
      <div ref={containerRef} />
      {isBlocked && !hasAd ? (
        <div data-carbon-fallback={true}>
          <p>Support Coolify by whitelisting Carbon ads in your ad blocker.</p>
          <span>
            Carbon ads help fund Coolify by showing ads on <code>coolify.io/docs</code>.
          </span>
        </div>
      ) : null}
    </aside>
  );
}
