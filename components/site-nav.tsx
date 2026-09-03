'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, KeyRound, User as UserIcon } from 'lucide-react';

export function SiteNav() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  const links = (
    <>
      <Link href="/#features" className="nav-link text-sm text-neutral-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
        Features
      </Link>
      <Link href="/#pricing" className="nav-link text-sm text-neutral-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
        Pricing
      </Link>
      <Link href="/#faq" className="nav-link text-sm text-neutral-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
        FAQ
      </Link>
      <Link href="/tool" className="nav-link text-sm text-neutral-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
        Free Tool
      </Link>
    </>
  );

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${scrolled ? 'nav-scrolled' : 'nav-top'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 glow-purple">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">ThumbRank</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">{links}</nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {profile?.plan === 'free' && (
                <Link href="/redeem">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-white/10 p-1 pr-3 hover:bg-white/5 transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-violet-600 text-white text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-neutral-200">{user.email?.split('@')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#141414] border-white/10">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-neutral-400">Signed in as</p>
                    <p className="truncate text-sm text-white">{user.email}</p>
                    {profile && (
                      <p className="mt-1 text-xs text-violet-400 capitalize">{profile.plan} plan</p>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-neutral-200 focus:bg-white/5 focus:text-white">
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-neutral-200 focus:bg-white/5 focus:text-white">
                    <Link href="/redeem"><KeyRound className="mr-2 h-4 w-4" /> Redeem Key</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-neutral-200 focus:bg-white/5 focus:text-white">
                    <Link href="/tool"><UserIcon className="mr-2 h-4 w-4" /> Free Tool</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white">
                  Log in
                </Button>
              </Link>
              <Link href="/login?mode=signup">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
                  Get started free
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-neutral-300" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0a] px-4 py-4 flex flex-col gap-4">
          {links}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-white/10 text-white">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-neutral-300" onClick={() => { signOut(); setOpen(false); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-white/10 text-white">Log in</Button>
                </Link>
                <Link href="/login?mode=signup" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-white">Get started free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
