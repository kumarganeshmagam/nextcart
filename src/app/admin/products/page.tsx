'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?limit=50&sort=newest');
      const data = await res.json();
      if (res.ok) setProducts(data.data);
    } catch (err) {
      showToast('Failed to fetch products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product deleted', 'success');
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500">Manage your inventory, prices, and listings.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="rounded-2xl h-14 px-8" data-testid="admin-add-product-btn">
            + Create New Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-16">Image</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4"><div className="h-12 bg-slate-100 animate-pulse rounded-xl"></div></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group" data-testid={`admin-product-row-${product.id}`}>
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden p-1 flex-shrink-0 border border-slate-200">
                        <Image src={product.image} alt={product.name} fill className="object-contain" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 leading-tight">{product.name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">{product.id.slice(-8)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="capitalize">{product.category.name}</Badge>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                         <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                         <span className="font-medium">{product.stock} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-10 w-10 p-0" title="Edit">
                               <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                               </svg>
                            </Button>
                         </Link>
                         <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 w-10 p-0 border-rose-100 hover:bg-rose-50 text-rose-600" 
                            onClick={() => handleDelete(product.id)}
                            title="Delete"
                            data-testid={`admin-delete-product-${product.id}`}
                          >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                         </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
