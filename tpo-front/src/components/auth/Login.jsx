import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message, 
  Avatar,
  Divider,
  Space
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const styles = {
  authContainer: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #4facfe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(30, 60, 114, 0.3) 0%, transparent 50%)
    `,
  },
  authCard: {
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 60px rgba(30, 60, 114, 0.25)',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.97)',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(79, 172, 254, 0.2)',
    position: 'relative',
    zIndex: 1,
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  titleStyle: {
    color: '#1e3c72',
    fontWeight: 'bold',
    fontSize: '28px',
    margin: '16px 0 8px 0',
    background: 'linear-gradient(45deg, #1e3c72, #2a5298, #4facfe)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitleStyle: {
    color: '#64748b',
    fontSize: '16px',
    margin: 0,
  },
  submitButton: {
    width: '100%',
    height: '48px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
    border: 'none',
    boxShadow: '0 8px 25px rgba(30, 60, 114, 0.4)',
    transition: 'all 0.3s ease',
  },
  switchButton: {
    color: '#2a5298',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  },
  inputStyle: {
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '15px',
    padding: '12px 16px',
    transition: 'all 0.3s ease',
  },
  iconStyle: {
    color: '#2a5298',
    fontSize: '16px',
  },
  formItem: {
    marginBottom: '20px',
  }
};

export default function Login({ onSwitchToRegister }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.backgroundDecoration}></div>
        <Card style={styles.authCard}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Avatar 
              size={80} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#22c55e', 
                marginBottom: '20px',
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
              }} 
            />
            <Title level={3} style={{ color: '#22c55e', margin: '0 0 8px 0' }}>
              ¡Ya has iniciado sesión!
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Bienvenido de vuelta
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const result = await login(values);
      
      if (!result.success) {
        message.error(result.error);
      } else {
        message.success('¡Inicio de sesión exitoso!');
      }
    } catch (error) {
      message.error('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.backgroundDecoration}></div>
      <Card style={styles.authCard}>
        <div style={{ padding: '40px 30px' }}>
          <div style={styles.titleContainer}>
            <Avatar 
              size={64} 
              icon={<LoginOutlined />}
              style={{ 
                backgroundColor: 'rgba(42, 82, 152, 0.15)',
                color: '#2a5298',
                marginBottom: '16px',
                border: '2px solid rgba(42, 82, 152, 0.2)'
              }}
            />
            <Title level={2} style={styles.titleStyle}>
              Iniciar Sesión
            </Title>
            <Text style={styles.subtitleStyle}>
              Bienvenido de vuelta al marketplace
            </Text>
          </div>
          
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              style={styles.formItem}
              rules={[
                { required: true, message: 'Por favor ingresa tu email' },
                { type: 'email', message: 'Por favor ingresa un email válido' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={styles.iconStyle} />}
                placeholder="Correo electrónico"
                style={styles.inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 0 3px rgba(42, 82, 152, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              style={styles.formItem}
              rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={styles.iconStyle} />}
                placeholder="Contraseña"
                style={styles.inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 0 3px rgba(42, 82, 152, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '30px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(30, 60, 114, 0.5)';
                  e.target.style.background = 'linear-gradient(45deg, #2a5298, #4facfe)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(30, 60, 114, 0.4)';
                  e.target.style.background = 'linear-gradient(45deg, #1e3c72, #2a5298)';
                }}
              >
                <Space>
                  <LoginOutlined />
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Space>
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0', borderColor: '#e2e8f0' }} />
          
          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '15px', color: '#64748b' }}>¿No tienes una cuenta? </Text>
            <Text 
              style={styles.switchButton}
              onClick={onSwitchToRegister}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(42, 82, 152, 0.1)';
                e.target.style.color = '#1e3c72';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#2a5298';
              }}
            >
              Regístrate aquí
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}