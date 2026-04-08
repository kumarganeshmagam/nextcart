'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.data);
      } else {
        showToast('Order not found', 'error');
        router.push('/profile');
      }
    } catch (err) {
      showToast('Failed to load order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="container py-20 text-center"><Skeleton className="h-[400px] w-full" /></div>;
  if (!order) return null;

  const shippingAddress = JSON.parse(order.shippingAddress as string);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Details</h1>
            <Badge variant={order.status === 'Delivered' ? 'success' : 'secondary'}>{order.status}</Badge>
          </div>
          <p className="text-slate-500 font-mono text-sm" data-testid="order-id">ID: #{order.id}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => window.print()}>Print Invoice</Button>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h2 className="font-bold text-slate-900">Items Ordered</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center space-x-6">
                  <div className="relative w-20 h-20 bg-slate-50 rounded-lg p-2 flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">${item.price.toFixed(2)} / unit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-slate-900 text-slate-300 rounded-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tracking Information
            </h3>
            <p className="text-sm leading-relaxed">
              Your order is being processed and will be shipped via <span className="text-white font-medium">{order.shippingMethod}</span>. 
              Once shipped, you will receive an email with your tracking number.
            </p>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-slate-900">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span className="text-slate-900">${order.tax.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-indigo-600 font-medium">
                  <span>Discount ({order.couponCode})</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 mt-4 border-t border-slate-100 items-center">
                <span className="font-bold text-slate-900 text-lg">Total</span>
                <span className="text-2xl font-black text-indigo-600" data-testid="order-total-price">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Shipping Address</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">{shippingAddress.name}</p>
              <p>{shippingAddress.address1}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
            <p className="text-xs text-indigo-800 font-bold uppercase tracking-widest mb-2">Need help?</p>
            <p className="text-sm text-indigo-600 mb-4">Questions about your order?</p>
            <Link href="/support">
              <Button variant="secondary" size="sm" className="w-full">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
