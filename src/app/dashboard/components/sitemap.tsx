
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { navItems } from '@/lib/dashboard-nav-items';
import { cn } from '@/lib/utils';

export function Sitemap() {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {navItems.map((item, index) => (
          <Link href={item.href} key={item.title} className="block group">
            <Card 
              className={cn(
                "glassmorphic h-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-primary/10 hover:border-primary/30 animate-in fade-in-0 slide-in-from-bottom-4",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                <item.icon className="h-8 w-8 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium text-foreground">{item.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
