import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 8,
  });

  const categories = await prisma.category.findMany({
    take: 4,
  });

  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-slate-900 h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
            Elevate Your Everyday with NexCart
          </h1>
          <p className="text-xl text-slate-200 mb-8 animate-fade-in-up delay-100">
            Discover a curated collection of premium gadgets, fashion, and home essentials designed for modern living.
          </p>
          <div className="flex space-x-4 animate-fade-in-up delay-200">
            <Link href="/products">
              <Button size="lg" data-testid="home-hero-cta-btn">
                Shop the Collection
              </Button>
            </Link>
            <Link href="/products?category=electronics">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-slate-900">
                View Gadgets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-slate-500 mt-2">Explore our wide range of products across different categories.</p>
          </div>
          <Link href="/products" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.slug}`}
              className="group relative h-64 overflow-hidden rounded-xl bg-slate-100"
              data-testid={`home-category-card-${category.slug}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-indigo-300">
                  {category.name}
                </h3>
                <p className="text-slate-200 text-sm mt-1 line-clamp-1">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-slate-500 mt-2">Handpicked items that we think you&apos;ll love.</p>
          </div>
          <Link href="/products" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Browse All →
          </Link>
        </div>
        <ProductGrid products={featuredProducts as any} data-testid="home-featured-products-grid" />
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <div 
          className="relative bg-indigo-600 rounded-2xl overflow-hidden p-12 md:p-20 text-center"
          data-testid="home-promo-banner"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-64 h-64 fill-current text-white" viewBox="0 0 24 24">
              <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 5h6v2H9V5zm11 15H4V9h5v2h2V9h2v2h2V9h5v11z" />
            </svg>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
              Spring Sale is Live!
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Get up to <span className="font-bold text-white">40% OFF</span> on your favorite items. Use code <span className="bg-white/20 px-2 py-1 rounded text-white font-mono" data-testid="promo-code">SAVE10</span> at checkout for an extra 10% discount.
            </p>
            <Link href="/products">
              <Button variant="secondary" size="lg" className="px-12 py-6 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                Shop the Sale Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
