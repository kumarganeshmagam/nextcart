'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function SupportPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      showToast('Support ticket created! We will contact you soon.', 'success');
      setIsLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-5xl">
       <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">How can we help?</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
             NexCart customers enjoy priority 24/7 support. Our team of experts is ready to assist you with anything you need.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
             <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 mb-1">Phone Support</h3>
                   <p className="text-sm text-slate-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                   <p className="text-indigo-600 font-bold">+1 (555) 000-0000</p>
                </div>
             </div>
             
             <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                   </svg>
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 mb-1">Live Chat</h3>
                   <p className="text-sm text-slate-500 mb-2">Available 24/7 for premium members.</p>
                   <button className="text-indigo-600 font-bold hover:underline">Start Chat Now</button>
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-3xl text-white overflow-hidden relative">
                <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-bold mb-4">FAQ Section</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                   Looking for quick answers? Check out our comprehensive documentation and frequently asked questions.
                </p>
                <Button variant="secondary" size="sm" className="w-full">Browse Help Center</Button>
             </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
             <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
                <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="First Name" required placeholder="Jane" data-testid="support-firstname-input" />
                      <Input label="Last Name" required placeholder="Doe" data-testid="support-lastname-input" />
                   </div>
                   <Input label="Email Address" type="email" required placeholder="jane@example.com" data-testid="support-email-input" />
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">How can we help?</label>
                      <select className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" data-testid="support-category-dropdown">
                         <option>Order Status</option>
                         <option>Refund Request</option>
                         <option>Product Inquiries</option>
                         <option>Technical Support</option>
                         <option>Other</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Message</label>
                      <textarea 
                         required 
                         rows={5} 
                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                         placeholder="Describe your issue in detail..."
                         data-testid="support-message-textarea"
                      ></textarea>
                   </div>
                   <Button type="submit" isLoading={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg" data-testid="support-submit-btn">
                      Send Support Request
                   </Button>
                </form>
             </div>
          </div>
       </div>
    </div>
  );
}
