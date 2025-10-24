
'use client';

import Link from 'next/link';

export default function NotFoundClient() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <span className="material-symbols-outlined text-6xl text-destructive mb-4">error</span>
      <h1 className="text-4xl font-bold font-headline">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90">
        Go to Homepage
      </Link>
    </div>
  )
}
