'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount?: number;
  onApplyCoupon: (code: string) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  shipping,
  total,
  discount = 0,
  onApplyCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (couponCode.trim()) {
      onApplyCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-6" data-testid="cart-summary">
      <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="text-slate-900 font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Discount</span>
            <span className="text-green-600 font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Estimated Tax</span>
          <span className="text-slate-900 font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping</span>
          <span className="text-slate-900 font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-4">
          <span>Total</span>
          <span data-testid="cart-total-price">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          containerClassName="flex-1"
          data-testid="cart-coupon-input"
        />
        <Button 
          variant="outline" 
          onClick={handleApply}
          data-testid="cart-coupon-apply-btn"
          className="mt-6" // Alignment fix for label
        >
          Apply
        </Button>
      </div>

      <Link href="/checkout" className="block w-full">
        <Button className="w-full" size="lg" data-testid="cart-checkout-btn">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
};
