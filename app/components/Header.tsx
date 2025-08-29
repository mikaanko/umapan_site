
'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

export default function Header() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-['Pacifico'] text-amber-700">
              うまじのパン屋
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://umajinopanya.take-eats.jp/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-amber-700 transition-colors flex items-center"
              suppressHydrationWarning={true}
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              商品を見る
            </a>
            
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-phone-line mr-2"></i>
              お問い合わせ
            </button>
          </div>
        </nav>
      </header>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}
