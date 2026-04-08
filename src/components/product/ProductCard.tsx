'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { useToast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { showToast } = useToast();
  const images = JSON.parse(product.images as unknown as string);
  const mainImage = images[0] || 'https://via.placeholder.com/400';
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added ${product.name} to cart!`, 'success');
    // Actual cart logic will be added later
  };

  return (
    <div 
      className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col"
      data-testid="product-card"
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-4">
              <Badge variant="danger" data-testid={`product-card-out-of-stock-${product.id}`}>
                Out of Stock
              </Badge>
            </div>
          )}
          {product.featured && !isOutOfStock && (
            <div className="absolute top-2 left-2">
              <Badge variant="default">Featured</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-1">
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              {product.category?.name || 'Category'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2" data-testid="product-card-name">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <Rating rating={product.rating} size="sm" />
            <span className="text-xs text-slate-500">({product.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900" data-testid="product-card-price">
              ${product.price.toFixed(2)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              data-testid="product-card-add-to-cart-btn"
            >
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
