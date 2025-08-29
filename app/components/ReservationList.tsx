
'use client';

import { useState, useEffect } from 'react';

interface Reservation {
  id: number;
  type: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  email: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    // サンプルデータを読み込み
    const sampleReservations: Reservation[] = [
      {
        id: 1,
        type: '事前予約',
        date: '2024-01-20',
        time: '11:00',
        customerName: '田中 太郎',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        items: [
          { name: 'クロワッサン', quantity: 3, price: 180 },
          { name: 'メロンパン', quantity: 2, price: 150 }
        ],
        totalPrice: 840,
        status: 'pending',
        createdAt: '2024-01-19 14:30'
      },
      {
        id: 2,
        type: '当日お取り置き',
        date: '2024-01-19',
        time: '14:30',
        customerName: '佐藤 花子',
        phone: '080-9876-5432',
        email: 'sato@example.com',
        items: [
          { name: '食パン（1斤）', quantity: 1, price: 280 },
          { name: 'あんぱん', quantity: 4, price: 120 }
        ],
        totalPrice: 760,
        status: 'completed',
        createdAt: '2024-01-19 09:15'
      },
      {
        id: 3,
        type: '事前予約',
        date: '2024-01-21',
        time: '15:00',
        customerName: '鈴木 一郎',
        phone: '070-1111-2222',
        email: 'suzuki@example.com',
        items: [
          { name: 'バゲット', quantity: 2, price: 200 },
          { name: 'チョコパン', quantity: 3, price: 160 }
        ],
        totalPrice: 880,
        status: 'confirmed',
        createdAt: '2024-01-18 16:45'
      }
    ];

    setReservations(sampleReservations);
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '確認待ち';
      case 'confirmed': return '確認済み';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const sendCancelEmail = async (reservation: Reservation, reason: string) => {
    setIsSendingEmail(true);
    
    try {
      // メール送信のシミュレーション（実際の実装ではAPIを呼び出し）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ステータス更新
      updateStatus(reservation.id, 'cancelled');
      
      // モーダルを閉じる
      setShowCancelModal(false);
      setSelectedReservation(null);
      setCancelReason('');
      
      alert(`${reservation.customerName}様にキャンセル通知メールを送信しました。`);
    } catch (error) {
      alert('メール送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const updateStatus = (id: number, newStatus: string) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === id ? { ...reservation, status: newStatus as any } : reservation
      )
    );
  };

  const exportToSpreadsheet = () => {
    const advanceReservations = reservations.filter(r => r.type === '事前予約');

    // CSVデータを作成（UTF-8 BOMを追加してExcelで文字化けを防ぐ）
    const headers = [
      '予約番号',
      '予約タイプ',
      '予約受付日時',
      '受取予定日',
      '受取予定時間',
      'お客様名',
      '電話番号',
      'メールアドレス',
      '商品名',
      '数量',
      '単価',
      '小計',
      '合計金額',
      '予約ステータス',
      '備考'
    ];

    // CSVの行データを作成
    const csvRows = [];
    advanceReservations.forEach(reservation => {
      reservation.items.forEach((item, index) => {
        const row = [
          reservation.id,
          reservation.type,
          reservation.createdAt,
          reservation.date,
          reservation.time,
          reservation.customerName,
          reservation.phone,
          reservation.email,
          item.name,
          item.quantity,
          item.price,
          item.price * item.quantity,
          index === 0 ? reservation.totalPrice : '',
          index === 0 ? getStatusLabel(reservation.status) : '',
          index === 0 ? '一括予約' : ''
        ];
        csvRows.push(row.join(','));
      });

      // 予約間の区切り行を追加
      csvRows.push(',,,,,,,,,,,,,,');
    });

    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    // UTF-8 BOMを追加
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // CSVファイルをダウンロード
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    // ファイル名に現在の日付を含める
    const today = new Date();
    const dateStr = today.getFullYear() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    link.setAttribute('download', `事前予約一覧_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAllReservations = () => {
    // 全予約データのCSV出力
    const headers = [
      '予約番号',
      '予約タイプ',
      '予約受付日時',
      '受取予定日',
      '受取予定時間',
      'お客様名',
      '電話番号',
      'メールアドレス',
      '商品名',
      '数量',
      '単価',
      '小計',
      '合計金額',
      '予約ステータス',
      '備考'
    ];

    const csvRows = [];
    reservations.forEach(reservation => {
      reservation.items.forEach((item, index) => {
        const row = [
          reservation.id,
          reservation.type,
          reservation.createdAt,
          reservation.date,
          reservation.time,
          reservation.customerName,
          reservation.phone,
          reservation.email,
          item.name,
          item.quantity,
          item.price,
          item.price * item.quantity,
          index === 0 ? reservation.totalPrice : '',
          index === 0 ? getStatusLabel(reservation.status) : '',
          index === 0 ? (reservation.type === '事前予約' ? '前日予約' : '当日予約') : ''
        ];
        csvRows.push(row.join(','));
      });
      csvRows.push(',,,,,,,,,,,,,,');
    });

    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const today = new Date();
    const dateStr = today.getFullYear() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    link.setAttribute('download', `全予約一覧_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter !== 'all' && reservation.status !== filter) return false;
    if (dateFilter && reservation.date !== dateFilter) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">予約管理</h2>
        <div className="flex gap-3">
          <button
            onClick={exportToSpreadsheet}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap flex items-center"
          >
            <i className="ri-file-excel-line mr-2"></i>
            事前予約CSV出力
          </button>
          <button
            onClick={exportAllReservations}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap flex items-center"
          >
            <i className="ri-download-line mr-2"></i>
            全予約CSV出力
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white pr-8"
            >
              <option value="all">すべて</option>
              <option value="pending">確認待ち</option>
              <option value="confirmed">確認済み</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">受取日</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 予約リスト */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">#{reservation.id}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                  {getStatusLabel(reservation.status)}
                </span>
                <span className="text-sm text-gray-500">{reservation.type}</span>
              </div>
              <div className="text-sm text-gray-500">
                予約日時: {reservation.createdAt}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">お客様情報</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><i className="ri-user-line mr-2"></i>{reservation.customerName}</p>
                  <p><i className="ri-phone-line mr-2"></i>{reservation.phone}</p>
                  <p><i className="ri-mail-line mr-2"></i>{reservation.email}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">受取情報</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><i className="ri-calendar-line mr-2"></i>{reservation.date}</p>
                  <p><i className="ri-time-line mr-2"></i>{reservation.time}</p>
                  <p><i className="ri-money-yen-circle-line mr-2"></i>¥{reservation.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">注文商品</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {reservation.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm">{item.name} × {item.quantity}</span>
                    <span className="text-sm font-medium">¥{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {reservation.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-1"></i>承認
                  </button>
                  <button
                    onClick={() => handleCancelReservation(reservation)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-close-line mr-1"></i>キャンセル
                  </button>
                </>
              )}
              {reservation.status === 'confirmed' && (
                <>
                  <button
                    onClick={() => updateStatus(reservation.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-check-double-line mr-1"></i>完了
                  </button>
                  <button
                    onClick={() => handleCancelReservation(reservation)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-close-line mr-1"></i>キャンセル
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">該当する予約がありません</p>
        </div>
      )}

      {/* キャンセル確認モーダル */}
      {showCancelModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-close-circle-line text-3xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">予約をキャンセルしますか？</h3>
              <p className="text-gray-600 text-sm">
                {selectedReservation.customerName}様（予約#{selectedReservation.id}）
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                キャンセル理由（お客様へのメールに記載されます）
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="例：材料不足のため、該当商品の提供が困難になりました"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{cancelReason.length}/200文字</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <i className="ri-mail-line mr-2"></i>
                キャンセル通知メールが {selectedReservation.email} に自動送信されます
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReservation(null);
                  setCancelReason('');
                }}
                disabled={isSendingEmail}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
              >
                戻る
              </button>
              <button
                onClick={() => sendCancelEmail(selectedReservation, cancelReason)}
                disabled={isSendingEmail}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
              >
                {isSendingEmail ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-1"></i>
                    送信中...
                  </>
                ) : (
                  <>
                    <i className="ri-mail-send-line mr-1"></i>
                    メール送信してキャンセル
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
