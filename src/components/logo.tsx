import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={cn("text-2xl font-bold tracking-tight text-foreground font-headline", className)}
      data-test-id="logo"
    >
      Dush<span className="text-primary">Rent</span>
    </Link>
  );
}
