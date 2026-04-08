'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Order } from '@/types';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok) setOrders(data.data);
    } catch (err) {
      showToast('Failed to fetch orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        showToast('Order status updated', 'success');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Management</h1>
        <p className="text-slate-500">Track and fulfill customer orders globally.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-4"><Skeleton className="h-12 w-full" /></td></tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group" data-testid={`admin-order-row-${order.id}`}>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600">
                       #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-900">{order.user?.name || 'Guest'}</p>
                       <p className="text-xs text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                       {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                       ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'error' : 'secondary'}>
                          {order.status}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end items-center space-x-3">
                          <select 
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            value={order.status}
                            className="bg-white border border-slate-200 text-xs rounded-lg p-1.5 focus:ring-indigo-500"
                            data-testid={`admin-order-status-select-${order.id}`}
                          >
                             <option value="Pending">Pending</option>
                             <option value="Processing">Processing</option>
                             <option value="Shipped">Shipped</option>
                             <option value="Delivered">Delivered</option>
                             <option value="Cancelled">Cancelled</option>
                          </select>
                          <Link href={`/orders/${order.id}`}>
                             <Button variant="outline" size="sm" className="px-4">View</Button>
                          </Link>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
