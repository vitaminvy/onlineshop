// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import CategoryPage from '@/pages/CategoryPage';
import SearchPage from '@/pages/SearchPage';
import Checkout from '@/pages/Checkout';



/**
 * Input: none
 * Process: render fixed header + light base background
 * Output: app shell in light mode
 */
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
     
<div/>
      {/* spacer for fixed header */}
      <div className="h-[101px]" />
      <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}