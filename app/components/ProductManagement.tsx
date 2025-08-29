
'use client';

import { useState, useEffect } from 'react';
import ProductEditModal from './ProductEditModal';

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

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('全て');
  const [selectedReservationType, setSelectedReservationType] = useState<string>('全て');
  
  const categories = ['全て', 'ソフト系', 'ハード系'];
  const reservationTypes = ['全て', '当日お取り置き', '事前予約', '両方対応'];

  useEffect(() => {
    // LocalStorageから商品データを読み込み、なければ初期データを設定
    const loadProducts = () => {
      const savedProducts = localStorage.getItem('bakery_products');
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
          return;
        } catch (error) {
          console.error('商品データの読み込みに失敗しました:', error);
        }
      }

      // 初期データを設定
      const sampleProducts: Product[] = [
        // ソフト系
        { id: 1, name: 'くるみぱん', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ZxjxLyytORue1foPjDwFbRCvcj6eXDWYmqvahUre.jpg?w=512', stock: 15, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 8, advanceStock: 7 },
        { id: 2, name: 'ぶどうぱん', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/zfu8QOrZy6gPLPWYLfQlJHTyvOw6CrSXN1ByXIdr.jpg?w=512', stock: 12, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 6, advanceStock: 6 },
        { id: 3, name: 'クランベリークリームチーズ', price: 291, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/805LRi3WtYU6uQG4MaTlO7GVUa1RxJ2vg7t1R7KD.png?w=512', stock: 8, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 3, advanceStock: 5 },
        { id: 4, name: '小倉ほいっぷ', price: 281, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ni99PvZarExik5B9HAAeMvy6SIWO3r2ngjOb8dv5.jpg?w=512', stock: 10, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 4, advanceStock: 6 },
        { id: 5, name: 'あんぱん', price: 259, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/dDCFbMWQ5TunuH5vRDmmY3Pp20zjGF5K82hm6iXA.jpg?w=512', stock: 0, category: 'ソフト系', isAvailable: false, reservationType: 'both', todayStock: 0, advanceStock: 0 },
        { id: 6, name: 'ゆずあんぱん', price: 281, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/1Rc342FgG9BL69mdCDxQFWKH9m8gqwbDa5SB8A0W.jpg?w=512', stock: 6, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 2, advanceStock: 4 },
        { id: 7, name: 'まるぱん', price: 137, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/cg4w7lfcx8aFqitxS9vzPmmwIEmQIyliNaQrpXnZ.jpg?w=512', stock: 20, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 12, advanceStock: 8 },
        { id: 8, name: 'おさとうぱん', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/YsSrL42LOxBFicet4kSfckSix7eDRPlsfAQSUL8Q.jpg?w=512', stock: 14, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 7, advanceStock: 7 },
        { id: 9, name: 'ほいっぷサンド', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/jMe1jNgDtEjEi0elWdMNFXaqRRVHaVlCCSN9j5dV.jpg?w=512', stock: 3, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 0, advanceStock: 3 },
        { id: 10, name: 'チョコレートほいっぷサンド', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/mMigc2JQ3o748o16qRLkB4xnidtlfbynYLEjnioq.jpg?w=512', stock: 5, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 1, advanceStock: 4 },
        { id: 11, name: 'ぼうしぱん', price: 248, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/JhctqRKT4Z2ZEjeYy7XXws6nMlRTZJIdDHfoK9An.jpg?w=512', stock: 7, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 3, advanceStock: 4 },
        { id: 12, name: 'ハムぱん', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/VT63lVHEOM0pE475ISiPQ9evmX66svUCGWSSdfNj.jpg?w=512', stock: 9, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 4, advanceStock: 5 },
        { id: 13, name: 'うぃんなーぱん', price: 151, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/EmQkuAM4LW2y6TUMRSadXXGsoowZPWInDQJG39yL.jpg?w=512', stock: 11, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 6, advanceStock: 5 },
        { id: 14, name: 'コーンぱん', price: 205, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/TXtRipMOdycgXTtrFD0oIiH4CdVmPulQi61Vn95i.jpg?w=512', stock: 2, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 0, advanceStock: 2 },
        { id: 15, name: 'マヨたまぱん', price: 248, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/AZ7cjJcJuJfGAvYcZlUugwFqwzqU2BQrhFOPva5d.jpg?w=512', stock: 13, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 8, advanceStock: 5 },
        { id: 16, name: '焼きカレーパン', price: 248, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/4P5u73i54Q8Q9zFwCeG9JzJnuwTM9qsBq1DTv8uQ.jpg?w=512', stock: 4, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 2, advanceStock: 2 },
        { id: 17, name: 'あんばたーサンド', price: 259, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/JOgv0eyvwZUkzIfxIsGs6tpuT8HnJrVBJqExxBFu.jpg?w=512', stock: 1, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 0, advanceStock: 1 },
        { id: 18, name: 'ベーコンチーズぱん', price: 227, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/EpphBRlMEYA7sNH9Rutk6BLhmLFWKIv7QfBd5zeH.jpg?w=512', stock: 16, category: 'ソフト系', isAvailable: true, reservationType: 'both', todayStock: 9, advanceStock: 7 },

        // ハード系
        { id: 19, name: 'バゲット(L)', price: 399, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/UvNuQlC805L424NQvJHFvv7RIZdpHWZh9v3Fdf1h.jpg?w=512', stock: 5, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 2, advanceStock: 3 },
        { id: 20, name: 'バゲット(S)', price: 261, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/lCwhcCJie57BeFIc3wn9G5Fm1bDJ4iHLwEam68gG.jpg?w=512', stock: 8, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 4, advanceStock: 4 },
        { id: 21, name: 'フィセル', price: 281, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/bqeNeWVr000UCmcpmfpJzwUEnY48ozFcFzL2e3Dd.jpg?w=512', stock: 3, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 1, advanceStock: 2 },
        { id: 22, name: 'プチちょこ', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/IjdAyVvejkkLyDhbme3zmB21HJhZeQRKGgaGeSP2.jpg?w=512', stock: 12, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 7, advanceStock: 5 },
        { id: 23, name: '小倉フランス', price: 173, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/FD4K0HqU5CillmtO6vRPiW76dTd89p90rij4zyZV.jpg?w=512', stock: 7, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 3, advanceStock: 4 },
        { id: 24, name: 'しおバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/wdugFVM6K4rmiRgMnLBYVXtDxzMh2OG5Sh5sQURT.jpg?w=512', stock: 0, category: 'ハード系', isAvailable: false, reservationType: 'both', todayStock: 0, advanceStock: 0 },
        { id: 25, name: 'シュガーバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/Sq68sid2EoKQ1mLaf32HoNCqWq0Jhc9FJCdpWtvz.jpg?w=512', stock: 4, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 2, advanceStock: 2 },
        { id: 26, name: 'じゃがちー', price: 389, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ngMjWBnePmB9R7uIF5GSQMJOPd8qv8UPFs7BNR8A.jpg?w=512', stock: 2, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 1, advanceStock: 1 },
        { id: 27, name: 'ベーコンエピ', price: 410, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/mnl9RL1FYtaMhT62rnnGx5ip1JaXjM5ivbONucwd.jpg?w=512', stock: 6, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 3, advanceStock: 3 },
        { id: 28, name: 'くるみレーズンバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/gl7f2sDN0zK49NJ2KOU6xfC7gcDx1JipsoEceBOO.jpg?w=512', stock: 1, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 0, advanceStock: 1 },
        { id: 29, name: 'くるみレーズンばとん', price: 313, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/ZG4PvP7J8BmzyuhyAhzZU8svYtB03v4ifF03fdbs.jpg?w=512', stock: 9, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 5, advanceStock: 4 },
        { id: 30, name: 'クランベリーバター', price: 335, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/AUiBX7rMDszXeOtucL3eUCMfR1Vnut7Gz7Ltwf2h.jpg?w=512', stock: 5, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 2, advanceStock: 3 },
        { id: 31, name: 'クランベリーばとん', price: 313, image: 'https://d1umvcecpsu7ql.cloudfront.net/storage/uploads/products/OTRqzpMRrCXxle3pdrpq57OHF8kupSK7AtuD6tzW.jpg?w=512', stock: 11, category: 'ハード系', isAvailable: true, reservationType: 'both', todayStock: 6, advanceStock: 5 }
      ];
      
      setProducts(sampleProducts);
      // LocalStorageに保存
      localStorage.setItem('bakery_products', JSON.stringify(sampleProducts));
    };

    loadProducts();
  }, []);

  // LocalStorageに商品データを保存する関数
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    localStorage.setItem('bakery_products', JSON.stringify(updatedProducts));
  };

  const updateTodayStock = (id: number, newStock: number) => {
    setProducts(prev => {
      const updated = prev.map(product => {
        if (product.id === id) {
          const updatedProduct = { ...product, todayStock: newStock };
          updatedProduct.stock = updatedProduct.todayStock + updatedProduct.advanceStock;
          updatedProduct.isAvailable = updatedProduct.stock > 0;
          return updatedProduct;
        }
        return product;
      });
      // LocalStorageに保存
      saveProductsToStorage(updated);
      return updated;
    });
  };

  const updateAdvanceStock = (id: number, newStock: number) => {
    setProducts(prev => {
      const updated = prev.map(product => {
        if (product.id === id) {
          const updatedProduct = { ...product, advanceStock: newStock };
          updatedProduct.stock = updatedProduct.todayStock + updatedProduct.advanceStock;
          updatedProduct.isAvailable = updatedProduct.stock > 0;
          return updatedProduct;
        }
        return product;
      });
      // LocalStorageに保存
      saveProductsToStorage(updated);
      return updated;
    });
  };

  const toggleAvailability = (id: number) => {
    setProducts(prev => {
      const updated = prev.map(product => 
        product.id === id 
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      );
      // LocalStorageに保存
      saveProductsToStorage(updated);
      return updated;
    });
  };

  const updatePrice = (id: number, newPrice: number) => {
    setProducts(prev => {
      const updated = prev.map(product => 
        product.id === id 
          ? { ...product, price: newPrice }
          : product
      );
      // LocalStorageに保存
      saveProductsToStorage(updated);
      return updated;
    });
  };

  const getReservationTypeLabel = (type: string) => {
    switch (type) {
      case 'today': return '当日のみ';
      case 'advance': return '事前のみ';
      case 'both': return '両方対応';
      default: return type;
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== '全て' && product.category !== selectedCategory) return false;
    
    if (selectedReservationType !== '全て') {
      switch (selectedReservationType) {
        case '当日お取り置き':
          return product.reservationType === 'today' || product.reservationType === 'both';
        case '事前予約':
          return product.reservationType === 'advance' || product.reservationType === 'both';
        case '両方対応':
          return product.reservationType === 'both';
        default:
          return true;
      }
    }
    
    return true;
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const updated = prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      );
      // LocalStorageに保存
      saveProductsToStorage(updated);
      return updated;
    });
    setEditingProduct(null);
    setShowEditModal(false);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
    setShowEditModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          新商品追加
        </button>
      </div>

      {/* フィルター部分 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">予約タイプ</label>
            <div className="flex gap-2">
              {reservationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedReservationType(type)}
                  className={`px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap ${
                    selectedReservationType === type
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <i className="ri-information-line mr-2"></i>
            <strong>当日お取り置き在庫が0になると、お客様の予約画面で「当日完売」と表示されます</strong>
          </p>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          表示中: {filteredProducts.length}商品 / 全{products.length}商品
        </p>
      </div>

      {/* 商品グリッド */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="relative mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isAvailable ? '販売中' : '停止中'}
                </span>
                {product.todayStock === 0 && product.advanceStock > 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    当日完売
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-600">{product.category}</p>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {getReservationTypeLabel(product.reservationType)}
              </span>
            </div>

            <div className="space-y-3">
              {/* 価格設定 */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">価格:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => updatePrice(product.id, Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
                  />
                  <span className="text-sm text-gray-600">円</span>
                </div>
              </div>

              {/* 当日お取り置き在庫 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-blue-800">当日お取り置き:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateTodayStock(product.id, Math.max(0, product.todayStock - 1))}
                      className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-300"
                    >
                      <i className="ri-subtract-line text-xs text-blue-700"></i>
                    </button>
                    <span className={`w-8 text-center text-sm font-medium ${
                      product.todayStock === 0 ? 'text-red-600' : product.todayStock <= 3 ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {product.todayStock}
                    </span>
                    <button
                      onClick={() => updateTodayStock(product.id, product.todayStock + 1)}
                      className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-300"
                    >
                      <i className="ri-add-line text-xs text-blue-700"></i>
                    </button>
                  </div>
                </div>
                {product.todayStock === 0 && (
                  <p className="text-xs text-red-600 font-medium">
                    <i className="ri-error-warning-line mr-1"></i>
                    お客様画面で「当日完売」表示中
                  </p>
                )}
              </div>

              {/* 事前予約在庫 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-green-800">事前予約:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateAdvanceStock(product.id, Math.max(0, product.advanceStock - 1))}
                      className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-300"
                    >
                      <i className="ri-subtract-line text-xs text-green-700"></i>
                    </button>
                    <span className={`w-8 text-center text-sm font-medium ${
                      product.advanceStock === 0 ? 'text-red-600' : product.advanceStock <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {product.advanceStock}
                    </span>
                    <button
                      onClick={() => updateAdvanceStock(product.id, product.advanceStock + 1)}
                      className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-300"
                    >
                      <i className="ri-add-line text-xs text-green-700"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* 合計在庫表示 */}
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">合計在庫:</span>
                  <span className={`font-bold ${
                    product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-yellow-600' : 'text-gray-800'
                  }`}>
                    {product.stock}個
                  </span>
                </div>
              </div>

              {/* 販売状態切り替え */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => toggleAvailability(product.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap ${
                    product.isAvailable
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {product.isAvailable ? '販売停止' : '販売開始'}
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                >
                  <i className="ri-edit-line mr-1"></i>編集
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 在庫アラート */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">在庫アラート</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 当日お取り置き完売アラート */}
          <div>
            <h4 className="font-medium text-red-700 mb-2 flex items-center">
              <i className="ri-error-warning-line mr-2"></i>
              当日お取り置き完売商品
            </h4>
            <div className="space-y-2">
              {products
                .filter(product => product.todayStock === 0)
                .map(product => (
                  <div key={product.id} className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.name} ({product.category})</span>
                      <span className="text-sm">お客様画面で「当日完売」表示中</span>
                    </div>
                  </div>
                ))}
              {products.filter(product => product.todayStock === 0).length === 0 && (
                <p className="text-gray-500 text-sm">当日お取り置き完売の商品はありません</p>
              )}
            </div>
          </div>
          
          {/* 低在庫アラート */}
          <div>
            <h4 className="font-medium text-yellow-700 mb-2 flex items-center">
              <i className="ri-alert-line mr-2"></i>
              低在庫商品（各3個以下）
            </h4>
            <div className="space-y-2">
              {products
                .filter(product => product.todayStock <= 3 && product.todayStock > 0 || product.advanceStock <= 3 && product.advanceStock > 0)
                .map(product => (
                  <div key={product.id} className="p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.name} ({product.category})</span>
                      <div className="text-sm">
                        当日: {product.todayStock}個 / 事前: {product.advanceStock}個
                      </div>
                    </div>
                  </div>
                ))}
              {products.filter(product => product.todayStock <= 3 && product.todayStock > 0 || product.advanceStock <= 3 && product.advanceStock > 0).length === 0 && (
                <p className="text-gray-500 text-sm">低在庫の商品はありません</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 編集モーダル */}
      <ProductEditModal
        product={editingProduct}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
