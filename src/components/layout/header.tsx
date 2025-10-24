
'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { Input } from '../ui/input';
import { useTranslation } from 'react-i18next';
import AuthPage from '@/app/auth/page';

const baseNavLinks = (t: any) => [
  { href: '/browse', label: t('Browse Cars') },
  { href: '/map', label: t('Map') },
];

export default function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { user, userProfile, isLoading } = useAuthWithProfile();
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const authType = searchParams.get('type');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      toast({
        title: t('Logged Out'),
        description: t('You have been successfully logged out.'),
      });
      router.push('/');
    });
  };

  const getNavLinks = () => {
    const links = baseNavLinks(t);
    if (!user) {
      return links;
    }

    if (isLoading || !userProfile) {
      return [];
    }

    switch (userProfile.role) {
      case 'admin':
        return [{ href: '/dashboard', label: t('Admin Dashboard') }];
      case 'owner':
        return [{ href: '/dashboard', label: t('Owner Dashboard') }];
      case 'customer':
      default:
        return [...links, { href: '/booking', label: t('My Bookings') }];
    }
  };

  const navLinks = getNavLinks();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0].substring(0, 2);
  };

  const showSearchBar = !user || userProfile?.role === 'customer';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          {
            'opacity-70': authType,
          }
        )}
      >
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <span className="material-symbols-outlined">menu</span>
                <span className="sr-only">{t('Toggle Menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs">
              <SheetTitle className="sr-only">{t('Menu')}</SheetTitle>
              <div className="p-4">
                <Logo />
              </div>
              <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                  <div className="space-y-1">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          'block rounded-md px-3 py-2 text-base font-medium',
                          pathname === link.href
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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

          <div className="flex flex-1 items-center justify-between gap-4">
            <div className="hidden md:flex">
              <Logo />
            </div>

            {showSearchBar && (
              <div className="flex flex-1 items-center justify-center">
                <div className="relative w-full max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
                  <Input
                    placeholder={t('Search for cars...')}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-colors hover:text-primary',
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-foreground/60'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <span className="material-symbols-outlined">language</span>
                    <span className="sr-only">{t('Change language')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => changeLanguage('en')}>
                    {t('English')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => changeLanguage('fr')}>
                    {t('Français')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!isClient || isLoading ? (
                <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {getInitials(userProfile?.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userProfile?.displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      <span className="material-symbols-outlined mr-2 h-4 w-4">
                        dashboard
                      </span>
                      {t('Dashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <span className="material-symbols-outlined mr-2 h-4 w-4">
                        logout
                      </span>
                      {t('Log out')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href="/auth?type=login">{t('Login')}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main
        className={cn('flex-1', {
          'opacity-70': authType,
        })}
      >
        {children}
      </main>
      {authType && <AuthPage />}
    </>
  );
}
