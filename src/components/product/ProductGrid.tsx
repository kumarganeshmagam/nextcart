import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  'data-testid'?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading = false,
  'data-testid': testId = 'product-grid' 
}) => {
  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
        data-testid="skeleton-product-grid"
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-8 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12" data-testid="search-no-results">
        <p className="text-slate-500">No products found.</p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
      data-testid={testId}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
