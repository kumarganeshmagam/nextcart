import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const categories = [
    { name: 'Electronics', href: '/products?category=electronics' },
    { name: 'Clothing', href: '/products?category=clothing' },
    { name: 'Books', href: '/products?category=books' },
    { name: 'Home & Garden', href: '/products?category=home-garden' },
  ];

  const company = [
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200" data-testid="footer">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">NexCart</h2>
            <p className="text-slate-500 text-sm max-w-xs">
              Your one-stop destination for quality gadgets, fashion, books, and home essentials. Experience premium shopping with NexCart.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-indigo-600 transition-colors" data-testid={`footer-category-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-indigo-600 transition-colors" data-testid={`footer-company-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} NexCart Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <p className="text-xs text-slate-400">Demo Target for AI Test Pipeline</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
