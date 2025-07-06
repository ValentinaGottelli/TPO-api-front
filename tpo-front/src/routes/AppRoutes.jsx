import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthRedux } from "../hooks/useAuth";
import AuthPages from "../components/auth/AuthPages";
import GeneralDashboard from "../components/dashboard/GeneralDashboard";
import SellerDashboard from "../components/seller/SellerDashboard";
import LoadingScreen from "../components/common/LoadingScreen";
import ProductsList from "../components/ProductsList";
import ProductDetail from "../components/ProductDetail";
import Cart from "../components/cart/Cart";
import CheckoutPage from "../components/buyer/checkout/Checkout";
import CheckoutSuccessPage from "../components/buyer/checkout/SuccessCheckout";

function RoleBasedRedirect() {
  const { user, isAuthenticated, loading, initialized } = useAuthRedux();
  
  if (loading || !initialized) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!user?.role) {
    return <Navigate to="/dashboard" replace />;
  }
  
  switch (user.role) {
    case "VENDEDOR":
      return <Navigate to="/seller" replace />;
    case "COMPRADOR":
    case "ADMIN":
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas de autenticación */}
      <Route 
        path="/auth" 
        element={
          <AuthGuard requireAuth={false}>
            <AuthPages />
          </AuthGuard>
        } 
      />
      
      {/* Rutas para vendedores */}
      <Route
        path="/seller/*"
        element={
          <AuthGuard requireAuth={true} allowedRoles={["VENDEDOR"]}>
            <SellerDashboard />
          </AuthGuard>
        }
      />
      
      {/* Dashboard general (todos los usuarios autenticados) */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard requireAuth={true}>
            <GeneralDashboard />
          </AuthGuard>
        }
      />
      
      {/* Rutas públicas de productos */}
      <Route path="/products" element={<ProductsList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      
      {/* Rutas del carrito */}
      <Route path="/cart" element={<Cart />} />
      <Route 
        path="/checkout" 
        element={
          <AuthGuard requireAuth={true}>
            <CheckoutPage />
          </AuthGuard>
        } 
      />
      <Route 
        path="/checkout/success" 
        element={
          <AuthGuard requireAuth={true}>
            <CheckoutSuccessPage />
          </AuthGuard>
        } 
      />
      
      {/* Ruta raíz - redirigir según autenticación */}
      <Route path="/" element={<RoleBasedRedirect />} />
      
      {/* Catch all - redirigir según autenticación */}
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}

export default AppRoutes;