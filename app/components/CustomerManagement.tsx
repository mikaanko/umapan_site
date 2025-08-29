
'use client';

import { useState, useEffect } from 'react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteProducts: string[];
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalSpent');

  useEffect(() => {
    // サンプル顧客データ
    const sampleCustomers: Customer[] = [
      {
        id: 1,
        name: '田中 太郎',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        totalOrders: 12,
        totalSpent: 8640,
        lastOrderDate: '2024-01-19',
        favoriteProducts: ['クロワッサン', 'メロンパン']
      },
      {
        id: 2,
        name: '佐藤 花子',
        phone: '080-9876-5432',
        email: 'sato@example.com',
        totalOrders: 8,
        totalSpent: 5420,
        lastOrderDate: '2024-01-18',
        favoriteProducts: ['食パン（1斤）', 'あんぱん']
      },
      {
        id: 3,
        name: '鈴木 一郎',
        phone: '070-1111-2222',
        email: 'suzuki@example.com',
        totalOrders: 15,
        totalSpent: 12800,
        lastOrderDate: '2024-01-20',
        favoriteProducts: ['バゲット', 'チョコパン', 'クロワッサン']
      },
      {
        id: 4,
        name: '高橋 美咲',
        phone: '090-3333-4444',
        email: 'takahashi@example.com',
        totalOrders: 6,
        totalSpent: 3240,
        lastOrderDate: '2024-01-17',
        favoriteProducts: ['メロンパン']
      },
      {
        id: 5,
        name: '伊藤 健太',
        phone: '080-5555-6666',
        email: 'ito@example.com',
        totalOrders: 20,
        totalSpent: 16200,
        lastOrderDate: '2024-01-19',
        favoriteProducts: ['食パン（1斤）', 'バゲット', 'あんぱん']
      }
    ];  

    setCustomers(sampleCustomers);
  }, []);

  const filteredCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        case 'lastOrder':
          return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 10000) return { label: 'ゴールド', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 5000) return { label: 'シルバー', color: 'bg-gray-100 text-gray-800' };
    return { label: 'ブロンズ', color: 'bg-orange-100 text-orange-800' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">顧客管理</h2>
        <div className="text-sm text-gray-600">
          総顧客数: {customers.length}人
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">顧客検索</label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="名前、電話番号、メールアドレスで検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">並び順</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white pr-8"
            >
              <option value="totalSpent">総購入金額</option>
              <option value="totalOrders">注文回数</option>
              <option value="lastOrder">最終注文日</option>
              <option value="name">名前順</option>
            </select>
          </div>
        </div>
      </div>

      {/* 顧客統計 */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">平均購入金額</p>
              <p className="text-xl font-bold text-gray-800">
                ¥{Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-money-yen-circle-line text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">リピート顧客</p>
              <p className="text-xl font-bold text-gray-800">
                {customers.filter(c => c.totalOrders > 1).length}人
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-refresh-line text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">優良顧客</p>
              <p className="text-xl font-bold text-gray-800">
                {customers.filter(c => c.totalSpent >= 10000).length}人
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="ri-vip-crown-line text-yellow-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 顧客リスト */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  お客様情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ランク
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注文回数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  総購入額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終注文
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  よく買う商品
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const tier = getCustomerTier(customer.totalSpent);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tier.color}`}>
                        {tier.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalOrders}回
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ¥{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.lastOrderDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.favoriteProducts.slice(0, 2).map((product, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {product}
                          </span>
                        ))}
                        {customer.favoriteProducts.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{customer.favoriteProducts.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-user-line text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">該当する顧客が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  );
}
