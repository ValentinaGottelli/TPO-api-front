import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { initializeAuth } from './store/slices/authSlice';
import { useAuthRedux } from './hooks/useAuth';

// Componentes
import AppRoutes from './routes/AppRoutes';
import LoadingScreen from './components/common/LoadingScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente interno que maneja la inicializacion
function AppContent() {
  const dispatch = useDispatch();
  const { initialized, loading } = useAuthRedux();

  useEffect(() => {
    if (!initialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  // Mostrar loading hasta que se inicialice la auten
  if (!initialized || loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

// Componente principal
function App() {
  return (
    <Provider store={store}>
      <AppContent />
      
      {/* Config global de Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </Provider>
  );
}

export default App;