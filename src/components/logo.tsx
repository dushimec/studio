import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Car } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={cn("flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground font-headline", className)}
      data-test-id="logo"
    >
      <Car className="h-7 w-7 text-primary"/>
      Auto<span className="text-primary">Nomad</span>
    </Link>
  );
}
