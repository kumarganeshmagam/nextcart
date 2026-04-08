'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) setCategories(data.data);
    } catch (err) {
      showToast('Failed to fetch categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Product Categories</h1>
          <p className="text-slate-500">Organize your catalog for better discoverability.</p>
        </div>
        <Button className="rounded-2xl h-14" data-testid="admin-add-category-btn">+ New Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl"></div>)
        ) : categories.map((category) => (
          <div key={category.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group" data-testid={`admin-category-card-${category.slug}`}>
             <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 font-black">
                {category.name.charAt(0)}
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">{category.name}</h3>
             <p className="text-sm text-slate-500 mb-6 line-clamp-2">{category.description}</p>
             <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400">{(category as any)._count?.products || 0} Products</span>
                <div className="flex space-x-2">
                   <button className="text-indigo-600 font-bold text-xs hover:underline">Edit</button>
                   <button className="text-rose-600 font-bold text-xs hover:underline">Delete</button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
