
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
  onLogout?: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const [activeTab, setActiveTab] = useState('reservations');

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-user-line text-amber-600 text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">管理画面</h1>
              <p className="text-sm text-gray-500">うまじのパン屋</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <i className="ri-user-line mr-1"></i>
              管理者でログイン中
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap flex items-center transition-colors"
              >
                <i className="ri-logout-box-line mr-2"></i>
                ログアウト
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
