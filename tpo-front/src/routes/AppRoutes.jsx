import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthRedux } from "../hooks/useAuth";

import AuthGuard from "../components/auth/AuthGuard";
import LoadingScreen from "../components/common/LoadingScreen";

import AuthPages from "../components/auth/AuthPages";
import GeneralDashboard from "../components/dashboard/GeneralDashboard";
import SellerDashboard from "../components/seller/SellerDashboard";

import ProductsList from "../components/ProductsList";
import ProductDetail from "../components/ProductDetail";

import Cart from "../components/cart/Cart";
import CheckoutSuccessPage from "../components/buyer/checkout/SuccessCheckout";
import CheckoutPage from "../components/buyer/checkout/Checkout";

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
      <Route 
        path="/auth" 
        element={
          <AuthGuard requireAuth={false}>
            <AuthPages />
          </AuthGuard>
        } 
      />
      
      <Route
        path="/seller/*"
        element={
          <AuthGuard requireAuth={true} allowedRoles={["VENDEDOR"]}>
            <SellerDashboard />
          </AuthGuard>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <AuthGuard requireAuth={true}>
            <GeneralDashboard />
          </AuthGuard>
        }
      />
      
      <Route path="/products" element={<ProductsList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      
      <Route path="/cart" element={<Cart />} />
      <Route 
        path="/checkout" 
        element={
          <AuthGuard requireAuth={true}>
            <CheckoutPage/>
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
      
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}

export default AppRoutes;