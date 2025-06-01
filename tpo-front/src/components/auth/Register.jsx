import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Select, 
  Typography, 
  message, 
  Avatar,
  Space,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  ShoppingCartOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext.jsx';

const { Title, Text } = Typography;
const { Option } = Select;

// Estilos personalizados
const styles = {
  authContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  registerCard: {
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
  },
  titleStyle: {
    textAlign: 'center',
    color: '#1890ff',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  submitButton: {
    width: '100%',
    height: '45px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
    border: 'none',
    boxShadow: '0 4px 15px rgba(24, 144, 255, 0.3)',
  },
  switchButton: {
    color: '#1890ff',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
  }
};

export default function Register({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();

  // Si ya está autenticado, mostrar mensaje
  if (isAuthenticated) {
    return (
      <div style={styles.authContainer}>
        <Card style={styles.registerCard}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#52c41a', marginBottom: '16px' }} />
            <Title level={3} style={{ color: '#52c41a', margin: 0 }}>¡Ya has iniciado sesión!</Title>
            <Text type="secondary">Bienvenido de vuelta</Text>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Remover confirmPassword antes de enviar
      const { confirmPassword, ...dataToSend } = values;
      const result = await register(dataToSend);
      
      if (!result.success) {
        message.error(result.error);
      } else {
        message.success('¡Registro exitoso! Bienvenido a la plataforma');
      }
    } catch (error) {
      message.error('Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <Card style={styles.registerCard}>
        <div style={{ padding: '20px' }}>
          <Title level={2} style={styles.titleStyle}>
            🚀 Crear Cuenta
          </Title>
          
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            initialValues={{ role: 'COMPRADOR' }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Nombre"
                  rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                    placeholder="Tu nombre"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  label="Apellido"
                  rules={[{ required: true, message: 'Por favor ingresa tu apellido' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                    placeholder="Tu apellido"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Por favor ingresa tu email' },
                { type: 'email', message: 'Por favor ingresa un email válido' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#1890ff' }} />}
                placeholder="tu@email.com"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Tipo de cuenta"
              rules={[{ required: true, message: 'Por favor selecciona un tipo de cuenta' }]}
            >
              <Select placeholder="Selecciona tu rol" style={{ borderRadius: '8px' }}>
                <Option value="COMPRADOR">
                  <Space>
                    <ShoppingCartOutlined style={{ color: '#52c41a' }} />
                    Comprador
                  </Space>
                </Option>
                <Option value="VENDEDOR">
                  <Space>
                    <ShopOutlined style={{ color: '#1890ff' }} />
                    Vendedor
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: 'Por favor ingresa tu contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                placeholder="Mínimo 6 caracteres"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirmar Contraseña"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Por favor confirma tu contraseña' },
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
                prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                placeholder="Repite tu contraseña"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.submitButton}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </Form.Item>
          </Form>

          <Divider />
          
          <div style={{ textAlign: 'center' }}>
            <Text>¿Ya tienes una cuenta? </Text>
            <Text 
              style={styles.switchButton}
              onClick={onSwitchToLogin}
            >
              Inicia sesión aquí
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}