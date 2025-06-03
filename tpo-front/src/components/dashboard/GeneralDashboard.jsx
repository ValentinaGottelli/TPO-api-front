import React from 'react';
import { 
  Layout, 
  Card, 
  Typography, 
  Avatar, 
  Space, 
  Button, 
  Row, 
  Col
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import RoleSelector from '../common/RoleSelector';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const styles = {
  dashboardLayout: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  headerStyle: {
    background: 'linear-gradient(90deg, #1890ff, #36cfc9)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  welcomeCard: {
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
  },
  infoCard: {
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  }
};

function GeneralDashboard() {
  const { user, logout } = useAuth();

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'VENDEDOR': return { text: 'Vendedor', icon: <ShopOutlined />, color: '#1890ff' };
      case 'COMPRADOR': return { text: 'Comprador', icon: <ShoppingCartOutlined />, color: '#52c41a' };
      case 'ADMIN': return { text: 'Administrador', icon: <CrownOutlined />, color: '#faad14' };
      default: return { text: 'Usuario', icon: <UserOutlined />, color: '#666' };
    }
  };

  const roleInfo = getRoleDisplay(user?.role);

  return (
    <Layout style={styles.dashboardLayout}>
      <Header style={styles.headerStyle}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            🏪 Marketplace
          </Title>
          <Space>
            <Avatar 
              style={{ backgroundColor: roleInfo.color }} 
              icon={roleInfo.icon}
            />
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {user?.name} {user?.lastName}
            </Text>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={logout}
              style={{ borderRadius: '8px' }}
            >
              Cerrar Sesión
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card style={styles.welcomeCard}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Avatar 
                    size={80} 
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '20px' }}
                    icon={roleInfo.icon}
                  />
                  <Title level={2} style={{ color: 'white', margin: '0 0 10px 0' }}>
                    ¡Bienvenido, {user?.name}! 🎉
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                    Has iniciado sesión exitosamente como <strong>{roleInfo.text}</strong>
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <TeamOutlined style={{ color: '#1890ff' }} />
                    <span>Información Personal</span>
                  </Space>
                }
                style={styles.infoCard}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>ID de Usuario:</Text>
                    <br />
                    <Text code>{user?.id}</Text>
                  </div>
                  <div>
                    <Text strong>Nombre Completo:</Text>
                    <br />
                    <Text>{user?.name} {user?.lastName}</Text>
                  </div>
                  <div>
                    <Text strong>Email:</Text>
                    <br />
                    <Text>{user?.email}</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    {roleInfo.icon}
                    <span>Tipo de Cuenta</span>
                  </Space>
                }
                style={styles.infoCard}
              >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Avatar 
                    size={64} 
                    style={{ backgroundColor: roleInfo.color, marginBottom: '16px' }}
                    icon={roleInfo.icon}
                  />
                  <Title level={4} style={{ color: roleInfo.color, margin: 0 }}>
                    {roleInfo.text}
                  </Title>
                  <Text type="secondary">
                    {user?.role === 'VENDEDOR' && 'Puedes crear y gestionar productos'}
                    {user?.role === 'COMPRADOR' && 'Puedes comprar y ver productos'}
                    {user?.role === 'ADMIN' && 'Tienes acceso completo al sistema'}
                    {!user?.role && 'Rol no especificado - Contacta al administrador'}
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24}>
              <RoleSelector />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default GeneralDashboard;