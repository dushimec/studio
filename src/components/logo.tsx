import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={cn("flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground font-headline", className)}
      data-test-id="logo"
    >
      <span className="material-symbols-outlined text-3xl text-primary">directions_car</span>
      Dush<span className="text-primary">Rent</span>
    </Link>
  );
}
