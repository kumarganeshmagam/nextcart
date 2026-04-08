'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Order, User } from '@/types';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchUserData();
      fetchOrders();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/users/me');
      const data = await res.json();
      if (res.ok) setUser(data.data);
    } catch (err) {
      console.error('Failed to fetch user');
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok) setOrders(data.data || []);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) return <div className="container py-20 text-center"><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-80 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4">
              {session?.user?.name?.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{session?.user?.name}</h2>
            <p className="text-slate-500 mb-6">{session?.user?.email}</p>
            <Badge variant={session?.user?.role === 'admin' ? 'primary' : 'secondary'} className="uppercase tracking-widest text-[10px]">
              {session?.user?.role} Account
            </Badge>
          </div>

          <nav className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors border-l-4 ${
                activeTab === 'orders' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
              data-testid="profile-tab-orders"
            >
              My Orders
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors border-l-4 ${
                activeTab === 'settings' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
              data-testid="profile-tab-settings"
            >
              Account Settings
            </button>
            <button 
               onClick={() => router.push('/support')}
              className="w-full text-left px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors border-l-4 border-transparent"
            >
              Customer Support
            </button>
            {session?.user?.role === 'admin' && (
              <button 
                onClick={() => router.push('/admin')}
                className="w-full text-left px-6 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-l-4 border-transparent"
                data-testid="profile-admin-dashboard-btn"
              >
                Admin Dashboard
              </button>
            )}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {activeTab === 'orders' ? (
            <div className="space-y-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group"
                      data-testid={`profile-order-item-${order.id}`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Order #{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <div className="text-right">
                            <p className="font-black text-slate-900">${order.total.toFixed(2)}</p>
                            <Badge variant={order.status === 'Delivered' ? 'success' : 'secondary'}>{order.status}</Badge>
                          </div>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-500 mb-6">You haven&apos;t placed any orders yet.</p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Display Name</label>
                       <input type="text" readOnly value={session?.user?.name || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none disabled" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Email Address</label>
                       <input type="email" readOnly value={session?.user?.email || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none disabled" />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button disabled>Save Changes</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
