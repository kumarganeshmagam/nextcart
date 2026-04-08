'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Admin User', email: 'admin@nexcart.com', role: 'admin', createdAt: '2024-01-01' },
    { id: '2', name: 'Demo User', email: 'user@nexcart.com', role: 'user', createdAt: '2024-01-02' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-02-15' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500">View and manage customer accounts and roles.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Joined</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors" data-testid={`admin-user-row-${user.id}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                       {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="outline" size="sm">Manage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
