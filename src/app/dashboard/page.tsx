
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from "./components/page-header";
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  useEffect(() => {
    if (role) {
      if (role === 'admin' || role === 'parent' || role === 'student') {
        router.replace(`/dashboard/${role}`);
      } else {
        // Fallback for unknown roles, maybe redirect to a default or error page
        router.replace('/dashboard/admin');
      }
    }
    // If no role, we might want to show a loading state or a default dashboard
    // For now, it will just wait for the role parameter. A loading skeleton is shown.
  }, [role, router]);

  return (
    <>
      <PageHeader title="Loading Dashboard..." description="Please wait while we redirect you." />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </>
  );
}
