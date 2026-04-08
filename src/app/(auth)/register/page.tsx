'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { showToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ form: data.error || 'Registration failed' });
        showToast(data.error || 'Registration failed', 'error');
      } else {
        showToast('Account created successfully!', 'success');
        router.push('/login');
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Join NexCart today for a premium shopping experience.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              data-testid="register-name-input"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              data-testid="register-email-input"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              data-testid="register-password-input"
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              data-testid="register-confirm-password-input"
            />
          </div>

          {errors.form && (
            <p className="text-red-500 text-sm text-center font-medium" data-testid="register-form-error">
              {errors.form}
            </p>
          )}

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              data-testid="register-terms-checkbox"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
              I agree to the <Link href="#" className="text-indigo-600 hover:text-indigo-500 underline">Terms and Conditions</Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            data-testid="register-submit-btn"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500" data-testid="register-login-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
