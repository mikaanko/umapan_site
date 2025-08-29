
'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
}

export default function SalesReport() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    // サンプル売上データ
    const sampleSalesData: SalesData[] = [
      { date: '1/14', sales: 12800, orders: 18 },
      { date: '1/15', sales: 15600, orders: 22 },
      { date: '1/16', sales: 18400, orders: 26 },
      { date: '1/17', sales: 14200, orders: 20 },
      { date: '1/18', sales: 19800, orders: 28 },
      { date: '1/19', sales: 22400, orders: 32 },
      { date: '1/20', sales: 16900, orders: 24 }
    ];

    const sampleProductSales: ProductSales[] = [
      { name: 'クロワッサン', quantity: 87, revenue: 15660 },
      { name: 'メロンパン', quantity: 64, revenue: 9600 },
      { name: '食パン（1斤）', quantity: 42, revenue: 11760 },
      { name: 'あんぱん', quantity: 56, revenue: 6720 },
      { name: 'バゲット', quantity: 28, revenue: 5600 },
      { name: 'チョコパン', quantity: 39, revenue: 6240 }
    ];

    setSalesData(sampleSalesData);
    setProductSales(sampleProductSales);
  }, []);

  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">売上分析</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white pr-8"
        >
          <option value="week">過去1週間</option>
          <option value="month">過去1ヶ月</option>
          <option value="quarter">過去3ヶ月</option>
        </select>
      </div>

      {/* サマリーカード */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">総売上</p>
              <p className="text-2xl font-bold text-blue-800">¥{totalSales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-money-yen-circle-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">注文数</p>
              <p className="text-2xl font-bold text-green-800">{totalOrders}件</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-shopping-cart-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">平均客単価</p>
              <p className="text-2xl font-bold text-purple-800">¥{Math.round(averageOrderValue).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-calculator-line text-xl text-purple-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">日平均売上</p>
              <p className="text-2xl font-bold text-orange-800">¥{Math.round(totalSales / 7).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="ri-calendar-line text-xl text-orange-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 売上グラフ */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">売上推移</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                formatter={(value: number) => [`¥${value.toLocaleString()}`, '売上']}
                labelFormatter={(label) => `日付: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#salesGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 商品別売上 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">商品別売上ランキング</h3>
        <div className="space-y-4">
          {productSales
            .sort((a, b) => b.revenue - a.revenue)
            .map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">販売数: {product.quantity}個</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">¥{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {((product.revenue / totalSales) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
