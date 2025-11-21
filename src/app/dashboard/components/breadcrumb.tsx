
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { navItems } from '@/lib/dashboard-nav-items';
import { cn } from '@/lib/utils';

// Create a map for quick lookup of page titles from the nav items
const navItemMap = new Map(navItems.map(item => [item.href, item.title]));

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment);

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    let title = navItemMap.get(href);

    // If title is not in map, capitalize the segment as a fallback
    if (!title) {
        title = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    
    return { href, title, isLast };
  });

  const dashboardHome = `/${segments.slice(0, 1).join('/')}`;

  if (segments.length <= 1) {
    return (
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
            <Home className="h-4 w-4" />
        </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
      <Link href={dashboardHome} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.slice(1).map((breadcrumb, index) => {
        return (
            <React.Fragment key={breadcrumb.href}>
                <ChevronRight className="h-4 w-4 mx-1" />
                <Link
                    href={breadcrumb.href}
                    className={cn(
                    'transition-colors',
                    breadcrumb.isLast
                        ? 'text-foreground cursor-default pointer-events-none'
                        : 'hover:text-foreground'
                    )}
                    aria-current={breadcrumb.isLast ? 'page' : undefined}
                >
                    {breadcrumb.title}
                </Link>
            </React.Fragment>
        )
       })}
    </nav>
  );
}
