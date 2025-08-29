
'use client';

import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'お問い合わせ件名を選択してください';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください';
    } else if (formData.message.length > 500) {
      newErrors.message = 'お問い合わせ内容は500文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // フォームデータを準備
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Edge Functionにメール送信リクエスト
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        
        // フォームをリセット
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error('送信に失敗しました');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('送信に失敗しました。しばらく経ってから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // エラーをクリア
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="ri-phone-line text-amber-600 mr-3"></i>
                お問い合わせ
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  placeholder="田中 太郎"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  placeholder="090-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ件名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm pr-8 bg-white appearance-none"
                  >
                    <option value="">選択してください</option>
                    <option value="予約について">予約について</option>
                    <option value="商品について">商品について</option>
                    <option value="営業時間について">営業時間について</option>
                    <option value="アクセス・場所について">アクセス・場所について</option>
                    <option value="その他">その他</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none"
                  placeholder="お問い合わせ内容をご記入ください"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                  <div className="ml-auto">
                    <span className={`text-sm ${formData.message.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.message.length}/500
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-700 flex items-start">
                  <i className="ri-information-line mr-2 mt-0.5 flex-shrink-0"></i>
                  お問い合わせは「umapan.umauma@gmail.com」に直接送信されます。1〜2営業日以内にメールまたはお電話でご連絡いたします。
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    送信中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="ri-send-plane-line mr-2"></i>
                    送信する
                  </div>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-3xl text-green-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              お問い合わせを送信しました
            </h2>
            <p className="text-gray-600 mb-6">
              お問い合わせありがとうございます。<br />
              「umapan.umauma@gmail.com」にメールが送信されました。<br />
              1〜2営業日以内にご連絡いたします。
            </p>
            <button
              onClick={handleClose}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
