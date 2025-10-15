
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/auth-context';

const baseNavLinks = [
  { href: '/browse', label: 'Browse Cars' },
  { href: '/recommendations', label: 'Smart Recommendations' },
  { href: '/map', label: 'Map' },
];

export default function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const getNavLinks = () => {
      if (!user) {
          return baseNavLinks;
      }

      switch (user.role) {
          case 'admin':
              return [{ href: '/admin', label: 'Admin' }];
          case 'owner':
              return [{ href: '/dashboard', label: 'Dashboard' }];
          case 'user':
              const userLinks = [...baseNavLinks];
              userLinks.push({ href: '/booking', label: 'My Bookings' });
              return userLinks;
          default:
            return baseNavLinks;
      }
  }

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="material-symbols-outlined">menu</span>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-4">
                  <Logo />
                </div>
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'block rounded-md px-3 py-2 text-base font-medium',
                            pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add a search bar here later if needed */}
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <Button onClick={logout} variant="ghost">Logout</Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
