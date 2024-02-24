'use client'

import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { PowerIcon } from '@heroicons/react/24/outline';

import SideNav from '@/app/ui/system-admin-dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {/* Render logout button here */}
        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </div>
        {/* Render children components */}
        {children}
      </div>
    </div>
  );
}
