'use client';

import { OwnerSidebar } from './owner-sidebar';

type OwnerLayoutProps = {
  children: React.ReactNode;
};

export function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <OwnerSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
