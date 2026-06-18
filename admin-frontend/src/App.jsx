import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import ProductsList from './components/Products/ProductsList';
import ProductDetail from './components/Products/ProductDetail';
import SyncPage from './components/Sync/SyncPage';
import ReviewsList from './components/Reviews/ReviewsList';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/sync" element={<SyncPage />} />
            <Route path="/reviews" element={<ReviewsList />} />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
