'use client';

import { useMemo } from 'react';

interface DateSelectorProps {
  reservationType: 'today' | 'advance';
  selectedDate: string;
  onDateChange: (date: string) => void;
  error?: string;
}

export default function DateSelector({ 
  reservationType, 
  selectedDate, 
  onDateChange, 
  error 
}: DateSelectorProps) {
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    if (reservationType === 'today') {
      // 当日のみ
      dates.push({
        value: today.toISOString().split('T')[0],
        label: `${today.getMonth() + 1}月${today.getDate()}日（本日）`,
        dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][today.getDay()]
      });
    } else {
      // 明日から2週間後まで
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        
        dates.push({
          value: dateStr,
          label: `${date.getMonth() + 1}月${date.getDate()}日`,
          dayOfWeek
        });
      }
    }
    
    return dates;
  }, [reservationType]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">受取日</h2>
      
      {reservationType === 'today' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <i className="ri-calendar-check-line text-2xl text-blue-600 mr-3"></i>
            <div>
              <p className="font-semibold text-blue-800">
                {availableDates[0]?.label}
              </p>
              <p className="text-sm text-blue-600">
                曜日: {availableDates[0]?.dayOfWeek}曜日
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableDates.map((date) => (
            <button
              key={date.value}
              type="button"
              onClick={() => onDateChange(date.value)}
              className={`p-3 rounded-lg border transition-all text-left ${
                selectedDate === date.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-sm">{date.label}</p>
              <p className="text-xs text-gray-500">{date.dayOfWeek}曜日</p>
            </button>
          ))}
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <i className="ri-error-warning-line mr-1"></i>
          {error}
        </p>
      )}
    </div>
  );
}