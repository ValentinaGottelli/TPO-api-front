import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedux } from '../../hooks/useAuth';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Select,
  message,
  Divider
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const { 
    register, 
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

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, getRedirectPath, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      
      if (result.success) {
        message.success('¡Registro exitoso! Bienvenido a Marketplace');
        
        // Redirect based on user role
        const redirectPath = getRedirectPath(result.data.role);
        navigate(redirectPath, { replace: true });
      } else {
        message.error(result.error || 'Error al registrarse');
      }
    } catch (error) {
      message.error('Error inesperado al registrarse');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar error de Redux si existe
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

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
          maxWidth: '450px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            🏪 Marketplace
          </Title>
          <Text type="secondary">Crea tu cuenta</Text>
        </div>

        <Form
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Ingresa tu nombre' },
                { min: 2, message: 'Mínimo 2 caracteres' }
              ]}
              style={{ width: '50%', marginRight: '8px' }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nombre"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: 'Ingresa tu apellido' },
                { min: 2, message: 'Mínimo 2 caracteres' }
              ]}
              style={{ width: '50%' }}
            >
              <Input
                placeholder="Apellido"
                size="large"
              />
            </Form.Item>
          </Space.Compact>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Ingresa tu email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Ingresa una contraseña' },
              { min: 6, message: 'Mínimo 6 caracteres' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirma tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmar contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Selecciona tu tipo de cuenta' }]}
          >
            <Select
              placeholder="Tipo de cuenta"
              size="large"
              suffixIcon={<TeamOutlined />}
            >
              <Option value="COMPRADOR">🛒 Comprador</Option>
              <Option value="VENDEDOR">🏪 Vendedor</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading || authLoading}
              icon={<UserAddOutlined />}
              block
            >
              Crear Cuenta
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">¿Ya tienes cuenta?</Text>
        </Divider>

        <Button
          type="link"
          onClick={onSwitchToLogin}
          block
          size="large"
        >
          Iniciar sesión
        </Button>
      </Card>
    </div>
  );
};

export default Register;