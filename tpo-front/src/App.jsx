// src/App.jsx - VERSIÓN FINAL (Sin CartProvider temporalmente)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { initializeAuth } from './store/slices/authSlice';

// Componentes de autenticación
import AuthPages from './components/auth/AuthPages';
import LoadingScreen from './components/common/LoadingScreen';

// Componentes principales
import GeneralDashboard from './components/dashboard/GeneralDashboard';
import SellerDashboard from './components/seller/SellerDashboard';

// Componentes de productos
import ProductsList from './components/ProductsList';
import ProductDetail from './components/ProductDetail';

// Componentes de carrito y checkout (comentados temporalmente)
// import Cart from './components/cart/Cart';
// import CheckoutPage from './components/buyer/checkout/Checkout';
// import CheckoutSuccessPage from './components/buyer/checkout/SuccessCheckout';

// Context del carrito (comentado temporalmente)
// import { CartProvider } from './context/CartContext';

// Componente para rutas protegidas
function ProtectedRoute({ children, allowedRoles = [] }) {
  const auth = useSelector(state => state.auth);

  if (!auth.initialized || auth.loading) {
    return <LoadingScreen />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && auth.user?.role && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Componente para redirigir según rol
function RoleBasedRedirect() {
  const auth = useSelector(state => state.auth);

  if (!auth.initialized || auth.loading) {
    return <LoadingScreen />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!auth.user?.role) {
    return <Navigate to="/dashboard" replace />;
  }

  switch (auth.user.role) {
    case "VENDEDOR":
      return <Navigate to="/seller" replace />;
    case "COMPRADOR":
    case "ADMIN":
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}

// Componente principal de la aplicación
function AppContent() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    // Inicializar autenticación al cargar la app
    if (!auth.initialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, auth.initialized]);

  // Mostrar loading hasta que se inicialice la autenticación
  if (!auth.initialized || auth.loading) {
    return <LoadingScreen />;
  }

  return (
    // Comentado temporalmente hasta que Redux funcione completamente
    // <CartProvider>
      <Router>
        <Routes>
          {/* Rutas de autenticación */}
          <Route 
            path="/auth" 
            element={
              auth.isAuthenticated ? <RoleBasedRedirect /> : <AuthPages />
            } 
          />

          {/* Rutas para vendedores */}
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute allowedRoles={["VENDEDOR"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard general (usuarios autenticados) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <GeneralDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas públicas de productos */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Rutas del carrito (comentadas temporalmente) */}
          {/*
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                <CheckoutSuccessPage />
              </ProtectedRoute>
            }
          />
          */}

          {/* Rutas temporales de carrito para evitar errores */}
          <Route path="/cart" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>🛒 Carrito (Temporalmente deshabilitado)</h2>
              <p>El carrito estará disponible una vez que se complete la migración a Redux.</p>
              <button onClick={() => window.history.back()}>← Volver</button>
            </div>
          } />

          {/* Ruta raíz - redirigir según autenticación */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Catch all - redirigir según autenticación */}
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Router>
    // </CartProvider>
  );
}

// Componente principal exportado
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;