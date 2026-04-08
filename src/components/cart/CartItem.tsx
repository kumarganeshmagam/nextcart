'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product!;
  const images = JSON.parse(product.images as unknown as string);
  const mainImage = images[0] || 'https://via.placeholder.com/400';

  return (
    <div className="flex py-6 border-b border-slate-200 animate-fade-in" data-testid={`cart-item-${item.productId}`}>
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
        <Image
          src={mainImage}
          alt={product.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-slate-900">
            <h3>
              <Link href={`/products/${product.id}`} className="hover:text-indigo-600 transition-colors">
                {product.name}
              </Link>
            </h3>
            <p className="ml-4">${(product.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-slate-500 line-clamp-1">{product.sku}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border border-slate-200 rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="p-1 hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
              data-testid={`cart-item-qty-decrease-${product.id}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-3 min-w-[2rem] text-center" data-testid={`cart-item-qty-${product.id}`}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={item.quantity >= product.stock}
              data-testid={`cart-item-qty-increase-${product.id}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
              data-testid={`cart-item-remove-btn-${product.id}`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
