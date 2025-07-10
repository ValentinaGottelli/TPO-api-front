import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedux } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Divider
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = ({ onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const { 
    login, 
    getRedirectPath, 
    isAuthenticated, 
    loading: authLoading,
    error,
    clearError 
  } = useAuthRedux();
  const navigate = useNavigate();

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Redirigir si ya esta autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, getRedirectPath, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      
      if (result.success) {
        // Toast de exito
        toast.success('¡Inicio de sesión exitoso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirect based on user role
        const redirectPath = getRedirectPath(result.data.role);
        navigate(redirectPath, { replace: true });
      } else {
        // Toast de error
        toast.error(result.error || 'Error al iniciar sesión', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      // Toast de error inesperado
      toast.error('Error inesperado al iniciar sesión', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            🏪 Marketplace
          </Title>
          <Text type="secondary">Inicia sesión en tu cuenta</Text>
        </div>

        <Form
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Por favor ingresa un email válido' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading || authLoading}
              icon={<LoginOutlined />}
              block
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">¿No tienes cuenta?</Text>
        </Divider>

        <Button
          type="link"
          onClick={onSwitchToRegister}
          block
          size="large"
        >
          Crear cuenta nueva
        </Button>
      </Card>
    </div>
  );
};

export default Login;