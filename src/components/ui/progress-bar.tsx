'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // We need to use a mutation observer to detect when the Next.js router
    // finishes its navigation. The 'routeChangeComplete' event is not
    // reliable enough with the App Router.
    const observer = new MutationObserver(() => {
        const url = `${pathname}?${searchParams}`;
        // You can add more logic here to check if the URL has actually changed
        handleStop();
    });

    // Start observing the body for attribute changes, which Next.js uses
    // to mark navigation state.
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
    });

    handleStart(); // Initial start
    
    // The first load might not trigger the observer, so we have a fallback
    const fallbackTimeout = setTimeout(() => {
        handleStop();
    }, 500); // Adjust timeout as needed


    return () => {
      clearTimeout(fallbackTimeout);
      observer.disconnect();
      handleStop();
    };
  }, [pathname, searchParams]);

  return null;
}
