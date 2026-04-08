'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartItemCount = 0; // Will implement cart context later

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600" data-testid="header-logo-link">
              NexCart
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 px-8 md:flex max-w-xl">
            <form onSubmit={handleSearch} className="relative w-full overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="header-search-input"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
              />
              <button
                type="submit"
                data-testid="header-search-btn"
                className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-400 hover:text-indigo-600 transition-colors"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex space-x-8 mr-4">
              <Link href="/products" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors" data-testid="nav-products-link">
                Products
              </Link>
            </nav>

            <Link href="/cart" className="relative p-2 text-slate-700 hover:text-indigo-600 transition-colors" data-testid="nav-cart-icon">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-[10px] font-bold leading-none text-white bg-indigo-600 rounded-full" data-testid="nav-cart-count">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative flex items-center space-x-4 pl-4 border-l border-slate-200">
                <Link href="/account/profile" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors" data-testid="nav-account-link">
                  {session.user?.name || 'Account'}
                </Link>
                {/* Admin Link if role is admin */}
                {(session.user as any).role === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors" data-testid="nav-admin-link">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  data-testid="nav-logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
                <Link href="/login" data-testid="nav-login-link">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register" data-testid="nav-register-link" className="hidden sm:block">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
