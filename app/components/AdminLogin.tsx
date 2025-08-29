'use client';

import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 管理者認証（デモ用の固定値）
    // 本番環境では、より安全な認証方式を使用してください
    const ADMIN_USERNAME = 'kinakoanko2016';
    const ADMIN_PASSWORD = 'umapan2024';

    setTimeout(() => {
      if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
        // ログイン成功
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        onLogin(true);
      } else {
        // ログイン失敗
        setError('ユーザー名またはパスワードが正しくありません');
        onLogin(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shield-user-line text-2xl text-amber-600"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">管理者ログイン</h1>
          <p className="text-gray-600 mt-2">うまじのパン屋 管理画面</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="ユーザー名を入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="パスワードを入力"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                ログイン中...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <i className="ri-login-box-line mr-2"></i>
                ログイン
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
            <i className="ri-information-line mr-2"></i>
            ログイン情報
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>ユーザー名:</strong> kinakoanko2016</p>
            <p><strong>パスワード:</strong> umapan2024</p>
            <p className="text-xs mt-2 text-blue-600">
              ※ セキュリティのため、本番環境では必ずパスワードを変更してください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}