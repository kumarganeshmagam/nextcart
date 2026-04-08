import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-[150px] font-black text-slate-100 leading-none select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
           <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Oops! Page not found.</h2>
        </div>
      </div>
      
      <p className="text-lg text-slate-500 max-w-md mb-10 leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/">
          <Button size="lg" className="px-8 h-14 rounded-2xl" data-testid="error-404-home-btn">
            Back to Home
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg" className="px-8 h-14 rounded-2xl">
            Browse Products
          </Button>
        </Link>
      </div>
      
      <div className="mt-16 pt-8 border-t border-slate-100 w-full max-w-lg">
         <p className="text-sm text-slate-400">
            Need help? Contact our <Link href="/support" className="text-indigo-600 font-bold hover:underline">Support Team</Link>
         </p>
      </div>
    </div>
  );
}
