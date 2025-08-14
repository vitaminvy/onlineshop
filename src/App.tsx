// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';

/**
 * Input: none
 * Process: render fixed header + light base background
 * Output: app shell in light mode
 */
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
     
<div className="h-[112px]" />
      {/* spacer for fixed header */}
      <div className="h-[96px]" />
      <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}