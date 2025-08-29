
'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  reservationType: 'today' | 'advance' | 'both';
  todayStock: number;
  advanceStock: number;
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  reservationType: 'today' | 'advance';
  cartItems: any[];
}

export default function ProductGrid({ onAddToCart, reservationType, cartItems }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 商品管理画面と同じデータを使用（リアルタイム在庫反映）
    const getLatestProducts = () => {
      // LocalStorageから最新の商品データを取得（管理画面で更新されたデータ）
      const savedProducts = localStorage.getItem('bakery_products');
      if (savedProducts) {
        try {
          return JSON.parse(savedProducts);
        } catch (error) {
          console.error('商品データの読み込みに失敗しました:', error);
        }
      }

      // 初期データ（管理画面と同じ）
      return [
        // ソフト系
        { id: 1, name: 'くるみぱん', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ZxjxLyytORue1foPjDwFbRCvcj6eXDWYmqvahUre.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 8, advanceStock: 7 },
        { id: 2, name: 'ぶどうぱん', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/zfu8QOrZy6gPLPWYLfQlJHTyvOw6CrSXN1ByXIdr.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 6, advanceStock: 6 },
        { id: 3, name: 'クランベリークリームチーズ', price: 291, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/805LRi3WtYU6uQG4MaTlO7GVUa1RxJ2vg7t1R7KD.png?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 3, advanceStock: 5 },
        { id: 4, name: '小倉ほいっぷ', price: 281, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ni99PvZarExik5B9HAAeMvy6SIWO3r2ngjOb8dv5.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 4, advanceStock: 6 },
        { id: 5, name: 'あんぱん', price: 259, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/dDCFbMWQ5TunuH5vRDmmY3Pp20zjGF5K82hm6iXA.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 0, advanceStock: 0 },
        { id: 6, name: 'ゆずあんぱん', price: 281, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/1Rc342FgG9BL69mdCDxQFWKH9m8gqwbDa5SB8A0W.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 2, advanceStock: 4 },
        { id: 7, name: 'まるぱん', price: 137, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/cg4w7lfcx8aFqitxS9vzPmmwIEmQIyliNaQrpXnZ.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 12, advanceStock: 8 },
        { id: 8, name: 'おさとうぱん', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/YsSrL42LOxBFicet4kSfckSix7eDRPlsfAQSUL8Q.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 7, advanceStock: 7 },
        { id: 9, name: 'ほいっぷサンド', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/jMe1jNgDtEjEi0elWdMNFXaqRRVHaVlCCSN9j5dV.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 0, advanceStock: 3 },
        { id: 10, name: 'チョコレートほいっぷサンド', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/mMigc2JQ3o748o16qRLkB4xnidtlfbynYLEjnioq.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 1, advanceStock: 4 },
        { id: 11, name: 'ぼうしぱん', price: 248, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/JhctqRKT4Z2ZEjeYy7XXws6nMlRTZJIdDHfoK9An.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 3, advanceStock: 4 },
        { id: 12, name: 'ハムぱん', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/VT63lVHEOM0pE475ISiPQ9evmX66svUCGWSSdfNj.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 4, advanceStock: 5 },
        { id: 13, name: 'うぃんなーぱん', price: 151, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/EmQkuAM4LW2y6TUMRSadXXGsoowZPWInDQJG39yL.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 6, advanceStock: 5 },
        { id: 14, name: 'コーンぱん', price: 205, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/TXtRipMOdycgXTtrFD0oIiH4CdVmPulQi61Vn95i.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 0, advanceStock: 2 },
        { id: 15, name: 'マヨたまぱん', price: 248, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/AZ7cjJcJuJfGAvYcZlUugwFqwzqU2BQrhFOPva5d.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 8, advanceStock: 5 },
        { id: 16, name: '焼きカレーパン', price: 248, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/4P5u73i54Q8Q9zFwCeG9JzJnuwTM9qsBq1DTv8uQ.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 2, advanceStock: 2 },
        { id: 17, name: 'あんばたーサンド', price: 259, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/JOgv0eyvwZUkzIfxIsGs6tpuT8HnJrVBJqExxBFu.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 0, advanceStock: 1 },
        { id: 18, name: 'ベーコンチーズぱん', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/EpphBRlMEYA7sNH9Rutk6BLhmLFWKIv7QfBd5zeH.jpg?w=512', category: 'ソフト系', reservationType: 'both', todayStock: 9, advanceStock: 7 },

        // ハード系
        { id: 19, name: 'バゲット(L)', price: 399, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/UvNuQlC805L424NQvJHFvv7RIZdpHWZh9v3Fdf1h.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 2, advanceStock: 3 },
        { id: 20, name: 'バゲット(S)', price: 261, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/lCwhcCJie57BeFIc3wn9G5Fm1bDJ4iHLwEam68gG.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 4, advanceStock: 4 },
        { id: 21, name: 'フィセル', price: 281, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/bqeNeWVr000UCmcpmfpJzwUEnY48ozFcFzL2e3Dd.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 1, advanceStock: 2 },
        { id: 22, name: 'プチちょこ', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/IjdAyVvejkkLyDhbme3zmB21HJhZeQRKGgaGeSP2.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 7, advanceStock: 5 },
        { id: 23, name: '小倉フランス', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/FD4K0HqU5CillmtO6vRPiW76dTd89p90rij4zyZV.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 3, advanceStock: 4 },
        { id: 24, name: 'しおバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/wdugFVM6K4rmiRgMnLBYVXtDxzMh2OG5Sh5sQURT.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 0, advanceStock: 0 },
        { id: 25, name: 'シュガーバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/Sq68sid2EoKQ1mLaf32HoNCqWq0Jhc9FJCdpWtvz.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 2, advanceStock: 2 },
        { id: 26, name: 'じゃがちー', price: 389, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ngMjWBnePmB9R7uIF5GSQMJOPd8qv8UPFs7BNR8A.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 1, advanceStock: 1 },
        { id: 27, name: 'ベーコンエピ', price: 410, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/mnl9RL1FYtaMhT62rnnGx5ip1JaXjM5ivbONucwd.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 3, advanceStock: 3 },
        { id: 28, name: 'くるみレーズンバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/gl7f2sDN0zK49NJ2KOU6xfC7gcDx1JipsoEceBOO.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 0, advanceStock: 1 },
        { id: 29, name: 'くるみレーズンばとん', price: 313, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ZG4PvP7J8BmzyuhyAhzZU8svYtB03v4ifF03fdbs.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 5, advanceStock: 4 },
        { id: 30, name: 'クランベリーバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/AUiBX7rMDszXeOtucL3eUCMfR1Vnut7Gz7Ltwf2h.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 2, advanceStock: 3 },
        { id: 31, name: 'クランベリーばとん', price: 313, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/OTRqzpMRrCXxle3pdrpq57OHF8kupSK7AtuD6tzW.jpg?w=512', category: 'ハード系', reservationType: 'both', todayStock: 6, advanceStock: 5 }
      ];
    };

    const initialProducts = getLatestProducts();
    setProducts(initialProducts);

    // LocalStorageの変更を監視して自動更新
    const handleStorageChange = () => {
      const updatedProducts = getLatestProducts();
      setProducts(updatedProducts);
    };

    // storage イベントリスナーを追加（他のタブでの変更を検知）
    window.addEventListener('storage', handleStorageChange);

    // 定期的にLocalStorageをチェック（同一タブ内での変更を検知）
    const interval = setInterval(() => {
      const currentProducts = getLatestProducts();
      setProducts(prev => {
        // 簡単な比較で変更があるかチェック
        if (JSON.stringify(prev) !== JSON.stringify(currentProducts)) {
          return currentProducts;
        }
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 予約タイプが変更された時に商品表示を強制更新
  useEffect(() => {
    // reservationTypeが変更された時にコンポーネントを強制再レンダリング
    setProducts(prevProducts => [...prevProducts]);
  }, [reservationType]);

  // カートに入っている数量を考慮した利用可能な商品を取得
  const getAvailableProducts = () => {
    return products.map(product => {
      const cartQuantity = cartItems.find(item => item.id === product.id)?.quantity || 0;
      const availableStock = reservationType === 'today' ? product.todayStock : product.advanceStock;
      const remainingStock = Math.max(0, availableStock - cartQuantity);
      
      return {
        ...product,
        todayStock: reservationType === 'today' ? remainingStock : product.todayStock,
        advanceStock: reservationType === 'advance' ? remainingStock : product.advanceStock
      };
    });
  };

  // 現在の予約タイプで選択可能な商品をフィルタリング（在庫チェック含む）
  const availableProducts = getAvailableProducts().filter(product => {
    const isTypeAvailable = product.reservationType === reservationType || product.reservationType === 'both';
    const hasStock = reservationType === 'today' ? product.todayStock > 0 : product.advanceStock > 0;
    return isTypeAvailable && hasStock;
  });

  // カテゴリーのオプションを動的に生成
  const categories = ['all', ...Array.from(new Set(availableProducts.map(p => p.category)))];
  const categoryLabels: { [key: string]: string } = {
    'all': 'すべて',
    'ソフト系': 'ソフト系',
    'ハード系': 'ハード系'
  };

  const filteredProducts = selectedCategory === 'all' 
    ? availableProducts 
    : availableProducts.filter(product => product.category === selectedCategory);

  // 完売商品を取得
  const soldOutProducts = getAvailableProducts().filter(product => {
    const isTypeRelevant = product.reservationType === reservationType || product.reservationType === 'both';
    const isSoldOut = reservationType === 'today' ? product.todayStock === 0 : product.advanceStock === 0;
    return isTypeRelevant && isSoldOut;
  });

  return (
    <div className="mb-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <i className="ri-shopping-bag-line text-amber-600 mr-2"></i>
            パンを選んでカートに追加
          </h2>
          <div className="text-sm text-gray-500">
            {reservationType === 'today' ? '当日お取り置き対象商品' : '事前予約対象商品'}
            （{filteredProducts.length}商品）
          </div>
        </div>

        {/* 予約タイプの説明 */}
        <div className={`p-4 rounded-xl mb-6 ${
          reservationType === 'today' 
            ? 'bg-blue-50 border border-blue-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center">
            <i className={`text-2xl mr-3 ${
              reservationType === 'today' 
                ? 'ri-calendar-today-line text-blue-600' 
                : 'ri-calendar-schedule-line text-green-600'
            }`}></i>
            <div>
              <h3 className={`font-semibold ${
                reservationType === 'today' ? 'text-blue-800' : 'text-green-800'
              }`}>
                {reservationType === 'today' ? '当日お取り置き' : '前日まで事前予約'}
              </h3>
              <p className={`text-sm ${
                reservationType === 'today' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {reservationType === 'today' 
                  ? '当日販売の在庫からお取り置きします（カートに入れた分は残り在庫から差し引かれます）' 
                  : '前日までのご予約で確実にお渡しできます（カートに入れた分は残り在庫から差し引かれます）'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 完売商品がある場合の通知 */}
        {soldOutProducts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
              <i className="ri-error-warning-line mr-2"></i>
              {reservationType === 'today' ? '当日お取り置き完売商品' : '事前予約完売商品'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {soldOutProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="text-sm text-orange-700 bg-orange-100 rounded-lg px-3 py-2">
                  {product.name}
                </div>
              ))}
              {soldOutProducts.length > 8 && (
                <div className="text-sm text-orange-600 px-3 py-2">
                  ...他{soldOutProducts.length - 8}商品
                </div>
              )}
            </div>
          </div>
        )}

        {/* カテゴリータブ */}
        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={`${product.id}-${reservationType}`}
            product={product}
            onAddToCart={onAddToCart}
            reservationType={reservationType}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">
            {soldOutProducts.length > 0 
              ? `選択したカテゴリーの商品は${reservationType === 'today' ? '当日お取り置き' : '事前予約'}完売です`
              : '選択したカテゴリーに商品がありません'
            }
          </p>
        </div>
      )}
    </div>
  );
}