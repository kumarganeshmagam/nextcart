'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { CartItem } from '@/types';
import Image from 'next/image';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    paymentMethod: 'credit_card',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    if (status === 'authenticated') {
      fetchCart();
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
      }));
    }
  }, [status]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (res.ok && data.data?.length > 0) {
        setCartItems(data.data);
      } else {
        router.push('/cart');
      }
    } catch (err) {
      showToast('Failed to load cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingCost = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const orderData = {
      subtotal,
      tax,
      shippingCost,
      total,
      shippingMethod: 'Standard',
      shippingAddress: {
        name: formData.name,
        address1: formData.address1,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Order placed successfully!', 'success');
        router.push(`/orders/${data.data.id}`);
      } else {
        showToast(data.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      showToast('An error occurred during checkout', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (isLoading) return <div className="container py-20 text-center">Loading checkout...</div>;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-12 tracking-tight">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-7 space-y-10">
          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">1</div>
              <h2 className="text-2xl font-bold text-slate-900">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="checkout-name-input"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="checkout-email-input"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Shipping Address"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  required
                  data-testid="checkout-address-input"
                />
              </div>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                data-testid="checkout-city-input"
              />
              <Input
                label="State / Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                data-testid="checkout-state-input"
              />
              <Input
                label="ZIP / Postal Code"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                data-testid="checkout-zip-input"
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  data-testid="checkout-country-dropdown"
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">2</div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <label className="flex items-center p-4 border rounded-xl cursor-pointer transition-colors border-indigo-600 bg-indigo-50/30">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  data-testid="checkout-payment-cc-radio"
                />
                <div className="ml-4 flex-1">
                  <span className="block font-bold text-slate-900">Credit or Debit Card</span>
                  <span className="text-xs text-slate-500">Pay securely with Stripe</span>
                </div>
                <div className="flex space-x-1 opacity-60">
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                </div>
              </label>
              <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50 border-slate-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  data-testid="checkout-payment-paypal-radio"
                />
                <div className="ml-4">
                  <span className="block font-bold text-slate-900">PayPal</span>
                  <span className="text-xs text-slate-500">Fast and secure payment</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl font-bold mb-8 relative z-10">Order Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden p-1 flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-contain" />
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1 text-slate-300 group-hover:text-white transition-colors">{item.product.name}</p>
                    </div>
                    <span className="text-sm font-bold text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10 relative z-10">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Taxes</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-black text-indigo-400" data-testid="checkout-total-amount">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full mt-10 h-16 text-xl rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                isLoading={isSubmitting}
                data-testid="checkout-place-order-btn"
              >
                Place Your Order
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4 px-8">
                By placing your order, you agree to NexCart&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
            
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <p className="text-sm text-indigo-800 font-medium flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Shopping for business? Switch to our B2B portal for bulk discounts and tax-exempt shipping.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
