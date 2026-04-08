'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CartItem as CartItemComponent } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { CartItem } from '@/types';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart');
      return;
    }
    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.data || []);
      }
    } catch (err) {
      showToast('Failed to load cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Optimistic update
    setCartItems(items => 
      items.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)
    );

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) {
        showToast('Failed to update quantity', 'error');
        fetchCart(); // Revert
      }
    } catch (err) {
      showToast('Unexpected error', 'error');
      fetchCart();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    // Optimistic update
    setCartItems(items => items.filter(item => item.id !== itemId));

    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      if (!res.ok) {
        showToast('Failed to remove item', 'error');
        fetchCart(); // Revert
      } else {
        showToast('Item removed', 'success');
      }
    } catch (err) {
      showToast('Unexpected error', 'error');
      fetchCart();
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 10 });
      showToast('Promo code applied! 10% off', 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Your Shopping Cart</h1>
      <p className="text-slate-500 mb-12">Review your items before proceeding to checkout.</p>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total Price</div>
              </div>
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <Link href="/products">
                <Button variant="outline" className="group">
                  <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                  Continue Shopping
                </Button>
              </Link>
              <div className="flex w-full sm:w-auto space-x-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 sm:w-48 bg-white border border-slate-200 rounded-lg px-4 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="cart-promo-input"
                />
                <Button variant="secondary" onClick={handleApplyPromo} data-testid="cart-apply-promo-btn">
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              discount={discount}
              onCheckout={() => router.push('/checkout')}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6">
            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added anything to your cart yet. Browse our products to find something you like.</p>
          <Link href="/products">
            <Button size="lg" className="px-12">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
