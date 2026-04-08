'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Product, Review } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProduct(data.data);
        setReviews(data.data.reviews || []);
      } else {
        showToast('Product not found', 'error');
        router.push('/products');
      }
    } catch (err) {
      showToast('Failed to load product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/products/${id}`);
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity }),
      });

      if (res.ok) {
        showToast('Added to cart!', 'success');
      } else {
        showToast('Failed to add to cart', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-slate-200">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`relative aspect-square overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                  activeImage === i-1 ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent hover:border-slate-300'
                }`}
                onClick={() => setActiveImage(i-1)}
              >
                <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-2">{product.category.name}</Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 leading-tight" data-testid="pdp-product-name">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4">
              <Rating value={product.rating} size="md" />
              <span className="text-slate-500 text-sm">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-3xl font-bold text-slate-900" data-testid="pdp-product-price">
              ${product.price.toFixed(2)}
            </span>
            <p className="mt-4 text-slate-600 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 mb-8 border-y border-slate-100 py-8">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-slate-900">Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-slate-50 border-r border-slate-200 text-slate-600 transition-colors"
                  data-testid="pdp-quantity-minus-btn"
                >
                  -
                </button>
                <span className="px-6 py-2 font-medium text-slate-900" data-testid="pdp-quantity-display">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 hover:bg-slate-50 border-l border-slate-200 text-slate-600 transition-colors"
                  data-testid="pdp-quantity-plus-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                className="flex-1 h-14 text-lg"
                onClick={handleAddToCart}
                isLoading={isAdding}
                data-testid="pdp-add-to-cart-btn"
              >
                Add to Cart
              </Button>
              <Button variant="outline" className="h-14 w-14 p-0">
                <svg className="w-6 h-6 fill-current text-slate-400" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-900">Free Shipping</p>
              <p className="text-slate-500">On orders over $100</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-900">Secure Payment</p>
              <p className="text-slate-500">100% secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="border-t border-slate-200 pt-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Customer Reviews</h2>
          <Button variant="outline" data-testid="pdp-write-review-btn">Write a Review</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="text-center">
                <p className="text-5xl font-black text-slate-900">{product.rating.toFixed(1)}</p>
                <div className="flex justify-center my-3">
                  <Rating value={product.rating} size="lg" />
                </div>
                <p className="text-slate-500">Based on {product.reviewCount} reviews</p>
              </div>
              <div className="mt-8 space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center text-sm">
                    <span className="w-4">{stars}</span>
                    <svg className="w-4 h-4 text-yellow-400 mx-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full mx-2 overflow-hidden">
                      <div className="bg-yellow-400 h-full" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-slate-400">{stars === 5 ? 70 : stars === 4 ? 20 : 5}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="pb-8 border-b border-slate-100 last:border-0" data-testid={`pdp-review-card-${review.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Rating value={review.rating} size="sm" />
                      <p className="font-bold text-slate-900 mt-1">Great product!</p>
                    </div>
                    <span className="text-sm text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4">{review.comment}</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      {review.user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{review.user.name}</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1 opacity-60">Verified Purchase</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
