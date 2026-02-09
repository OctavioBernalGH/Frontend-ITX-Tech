import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import './App.css';
import { CartProvider } from './context/CartContext';
import { CartPage } from './pages/CartPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProductList />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;