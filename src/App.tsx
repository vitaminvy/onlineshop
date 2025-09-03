// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import CategoryPage from "@/pages/CategoryPage";
import SearchPage from "@/pages/SearchPage";
import Checkout from "@/pages/Checkout";
import { Toaster } from "sonner";
import OrderSuccess from "@/pages/OrderSuccess";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Wishlist from "@/pages/Wishlist";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
import Profile from "@/pages/Profile";

/**
 * Input: none
 * Process: render fixed header + light base background
 * Output: app shell in light mode
 */
export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Navbar />

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
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <FloatingCartButton />
      </div>
    </BrowserRouter>
  );
}
