'use client';

import { useOnlineStatus } from '~/hooks/useOnlineStatus';
import { useEffect } from 'react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      document.documentElement.style.setProperty('--banner-height', '2.5rem');
    } else {
      document.documentElement.style.setProperty('--banner-height', '0px');
    }

    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center p-2 mt-4">
      You are currently offline. Some features may not be available.
    </div>
  );
}
