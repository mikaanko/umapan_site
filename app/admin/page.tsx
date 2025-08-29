
'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import ReservationList from '../components/ReservationList';
import ProductManagement from '../components/ProductManagement';
import SalesReport from '../components/SalesReport';
import CustomerManagement from '../components/CustomerManagement';
import AdminLogin from '../components/AdminLogin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    // ログイン状態をチェック
    const checkAuthentication = () => {
      const authenticated = localStorage.getItem('adminAuthenticated');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (authenticated === 'true' && loginTime) {
        // 24時間でセッション期限切れ
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(loginTime);
        const hoursElapsed = timeDiff / (1000 * 60 * 60);
        
        if (hoursElapsed < 24) {
          setIsAuthenticated(true);
        } else {
          // セッション期限切れ
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminLoginTime');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-amber-600 animate-spin mb-4"></i>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">管理画面</h1>
          <p className="text-gray-600">うまじのパン屋の予約・商品・売上を総合管理</p>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-0">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 px-6 py-4 text-center font-medium rounded-l-xl transition-colors cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="ri-calendar-check-line mr-2"></i>
              予約管理
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="ri-bread-line mr-2"></i>
              商品管理
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="ri-bar-chart-line mr-2"></i>
              売上分析
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 px-6 py-4 text-center font-medium rounded-r-xl transition-colors cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="ri-user-line mr-2"></i>
              顧客管理
            </button>
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {activeTab === 'reservations' && <ReservationList />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'sales' && <SalesReport />}
          {activeTab === 'customers' && <CustomerManagement />}
        </div>
      </div>
    </div>
  );
}
