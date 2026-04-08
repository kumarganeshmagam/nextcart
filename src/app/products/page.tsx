'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Product, Category } from '@/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState(500);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy, initialQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.append('category', activeCategory);
      if (sortBy) params.append('sort', sortBy);
      if (initialQuery) params.append('q', initialQuery);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === '' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                data-testid="filter-category-all"
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === cat.slug ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  data-testid={`filter-category-${cat.slug}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Price Range</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                data-testid="filter-price-range"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <span>$0</span>
                <span className="font-bold text-indigo-600">${priceRange}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((stars) => (
                <label key={stars} className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">
                    {stars}+ Stars
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-900">In Stock Only</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                <input type="checkbox" className="sr-only peer" data-testid="filter-in-stock-toggle" />
                <div className="after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </div>
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeCategory 
                  ? categories.find(c => c.slug === activeCategory)?.name 
                  : initialQuery 
                    ? `Search results for "${initialQuery}"`
                    : 'All Products'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">{products.length} products found</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                data-testid="sort-dropdown"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>

          <ProductGrid 
            products={products.filter(p => p.price <= priceRange)} 
            isLoading={isLoading} 
            data-testid="products-list-grid"
          />

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <div className="mt-12 flex justify-center items-center space-x-4">
              <Button variant="outline" size="sm" data-testid="pagination-prev-btn" disabled>Previous</Button>
              <div className="flex space-x-2">
                <Button variant="primary" size="sm" data-testid="pagination-page-1">1</Button>
                <Button variant="outline" size="sm" data-testid="pagination-page-2">2</Button>
                <Button variant="outline" size="sm" data-testid="pagination-page-3">3</Button>
              </div>
              <Button variant="outline" size="sm" data-testid="pagination-next-btn">Next</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
