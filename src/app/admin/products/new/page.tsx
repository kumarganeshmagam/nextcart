'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Category } from '@/types';

export default function AdminProductFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: '',
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) setCategories(data.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (res.ok) {
        const p = data.data;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          stock: p.stock.toString(),
          categoryId: p.categoryId,
          image: p.image,
          featured: p.featured,
        });
      }
    } catch (err) {
      showToast('Failed to fetch product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      // Note: We'll create /api/admin/products for this
      const url = isEdit ? `/api/admin/products/${id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(isEdit ? 'Product updated' : 'Product created', 'success');
        router.push('/admin/products');
      } else {
        const error = await res.json();
        showToast(error.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center space-x-4 mb-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
           <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
           </svg>
        </button>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {isEdit ? 'Modify Product' : 'New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8" data-testid="admin-product-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Premium Wireless Headphones"
              data-testid="admin-product-name-input"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
              placeholder="Detailed product specification and features..."
              data-testid="admin-product-desc-textarea"
            />
          </div>

          <Input
            label="Price ($)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            data-testid="admin-product-price-input"
          />

          <Input
            label="Initial Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
            data-testid="admin-product-stock-input"
          />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              data-testid="admin-product-category-dropdown"
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="https://images.unsplash.com/..."
            data-testid="admin-product-image-input"
          />

          <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
            <div>
               <p className="font-bold text-slate-900">Featured Product</p>
               <p className="text-xs text-slate-500">Show this product in the home page featured collection.</p>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="sr-only peer"
                data-testid="admin-product-featured-toggle"
              />
              <div className="after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} className="px-12" data-testid="admin-product-submit-btn">
             {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
