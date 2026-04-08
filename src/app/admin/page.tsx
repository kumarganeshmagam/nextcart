'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 24590.00,
    totalOrders: 142,
    totalUsers: 856,
    avgOrderValue: 173.16,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500">Welcome to NexCart Management Studio.</p>
        </div>
        <div className="flex space-x-3 text-sm">
           <Badge variant="secondary" className="px-4 py-2">Last 30 Days</Badge>
           <Button variant="outline" size="sm">Download Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalSales.toLocaleString()}`, change: '+12.5%', color: 'indigo' },
          { label: 'Active Orders', value: stats.totalOrders, change: '+5.2%', color: 'emerald' },
          { label: 'New Customers', value: stats.totalUsers, change: '+18.1%', color: 'amber' },
          { label: 'Avg. Order', value: `$${stats.avgOrderValue}`, change: '-2.4%', color: 'rose' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-${stat.color}-100/50 blur-3xl group-hover:scale-150 transition-transform`}></div>
             <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">{stat.label}</p>
             <div className="flex items-baseline space-x-2 relative z-10">
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {stat.change}
                </span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="font-bold">Sales Volume Analytics</p>
            <p className="text-xs">Interactive chart placeholder</p>
         </div>
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <p className="font-bold">Category Distribution</p>
            <p className="text-xs">Interactive chart placeholder</p>
         </div>
      </div>
    </div>
  );
}
