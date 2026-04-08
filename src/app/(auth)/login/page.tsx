'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ form: 'Invalid email or password' });
        showToast('Login failed. Please check your credentials.', 'error');
      } else {
        showToast('Login successful!', 'success');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login to NexCart</h1>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back! Enter your details to continue.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@nexcart.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              data-testid="login-email-input"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              data-testid="login-password-input"
            />
          </div>

          {errors.form && (
            <p className="text-red-500 text-sm text-center font-medium" data-testid="login-form-error">
              {errors.form}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                data-testid="login-remember-me-checkbox"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                Remember me
              </label>
            </div>

            <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            data-testid="login-submit-btn"
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500" data-testid="login-register-link">
            Register for free
          </Link>
        </p>
        
        {/* Helper for QA */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-slate-600">
            <p>User: <span className="font-mono bg-white px-1">user@nexcart.com</span> / <span className="font-mono bg-white px-1">password123</span></p>
            <p>Admin: <span className="font-mono bg-white px-1">admin@nexcart.com</span> / <span className="font-mono bg-white px-1">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
