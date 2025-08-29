'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  isAvailable: boolean;
  reservationType: 'today' | 'advance' | 'both';
  todayStock: number;
  advanceStock: number;
}

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export default function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['ソフト系', 'ハード系'];
  const reservationTypes = [
    { value: 'today', label: '当日お取り置きのみ' },
    { value: 'advance', label: '事前予約のみ' },
    { value: 'both', label: '両方対応' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setErrors({});
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (!formData) return;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => prev ? { ...prev, [name]: checked } : null);
    } else if (name === 'price' || name === 'todayStock' || name === 'advanceStock') {
      const numValue = Number(value);
      setFormData(prev => {
        if (!prev) return null;
        const updated = { ...prev, [name]: numValue };
        // 在庫が変更された場合、合計在庫も更新
        if (name === 'todayStock' || name === 'advanceStock') {
          updated.stock = updated.todayStock + updated.advanceStock;
          updated.isAvailable = updated.stock > 0;
        }
        return updated;
      });
    } else {
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
    }

    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    if (!formData) return false;
    
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = '商品名を入力してください';
    }

    if (formData.price <= 0) {
      newErrors.price = '価格は0円より大きく設定してください';
    }

    if (formData.todayStock < 0) {
      newErrors.todayStock = '当日お取り置き在庫は0以上で設定してください';
    }

    if (formData.advanceStock < 0) {
      newErrors.advanceStock = '事前予約在庫は0以上で設定してください';
    }

    if (!formData.category) {
      newErrors.category = 'カテゴリーを選択してください';
    }

    if (!formData.reservationType) {
      newErrors.reservationType = '予約タイプを選択してください';
    }

    if (!formData.image.trim()) {
      newErrors.image = '商品画像URLを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateForm()) return;

    setIsSaving(true);

    // 保存処理をシミュレート
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
      setErrors({});
    }
  };

  if (!isOpen || !product || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <i className="ri-edit-line text-blue-600 mr-2"></i>
              商品情報編集
            </h2>
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 商品画像プレビュー */}
            <div className="text-center">
              <img
                src={formData.image}
                alt={formData.name}
                className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128?text=No+Image';
                }}
              />
              <p className="text-sm text-gray-500 mt-2">現在の商品画像</p>
            </div>

            {/* 基本情報 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="商品名を入力"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  価格（円） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="価格を入力"
                  min="1"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            {/* カテゴリーと予約タイプ */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="">カテゴリーを選択</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  予約タイプ <span className="text-red-500">*</span>
                </label>
                <select
                  name="reservationType"
                  value={formData.reservationType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="">予約タイプを選択</option>
                  {reservationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.reservationType && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {errors.reservationType}
                  </p>
                )}
              </div>
            </div>

            {/* 在庫設定 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  当日お取り置き在庫
                </label>
                <input
                  type="number"
                  name="todayStock"
                  value={formData.todayStock}
                  onChange={handleInputChange}
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="当日在庫数"
                  min="0"
                />
                {errors.todayStock && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {errors.todayStock}
                  </p>
                )}
                {formData.todayStock === 0 && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    <i className="ri-error-warning-line mr-1"></i>
                    お客様画面で「当日完売」と表示されます
                  </p>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  事前予約在庫
                </label>
                <input
                  type="number"
                  name="advanceStock"
                  value={formData.advanceStock}
                  onChange={handleInputChange}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="事前予約在庫数"
                  min="0"
                />
                {errors.advanceStock && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {errors.advanceStock}
                  </p>
                )}
              </div>
            </div>

            {/* 合計在庫表示 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">合計在庫:</span>
                <span className={`text-lg font-bold ${
                  formData.stock === 0 ? 'text-red-600' : formData.stock <= 5 ? 'text-yellow-600' : 'text-gray-800'
                }`}>
                  {formData.stock}個
                </span>
              </div>
            </div>

            {/* 商品画像URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品画像URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <i className="ri-error-warning-line mr-1"></i>
                  {errors.image}
                </p>
              )}
            </div>

            {/* 販売状態 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="font-medium text-gray-700">この商品を販売する</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-7">
                チェックを外すと、お客様の予約画面で非表示になります
              </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    保存中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="ri-save-line mr-2"></i>
                    保存する
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}