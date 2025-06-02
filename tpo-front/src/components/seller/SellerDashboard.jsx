import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Table,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Modal,
  message,
  Tag,
  Image,
  Popconfirm,
  Empty,
  Avatar,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShopOutlined,
  DollarOutlined,
  InboxOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import ProductForm from './ProductForm';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadUserProducts();
  }, []);

  const loadUserProducts = async () => {
    setLoading(true);
    try {
      const userProducts = await productService.getUserProducts(user.id);
      setProducts(userProducts || []);
    } catch (error) {
      message.error('Error al cargar productos: ' + error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    setDeleteLoading(productId);
    try {
      await productService.deleteProduct(productId);
      message.success('Producto eliminado exitosamente');
      await loadUserProducts();
    } catch (error) {
      message.error('Error al eliminar producto: ' + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleProductFormSuccess = async () => {
    setShowProductForm(false);
    setEditingProduct(null);
    await loadUserProducts();
  };

  const handleProductFormCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Calcular estadísticas
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity < 5).length;

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images) => {
        const imageUrl = images && images.length > 0 ? images[0] : null;
        return (
          <Image
            width={60}
            height={60}
            src={imageUrl}
            style={{ 
              objectFit: 'cover',
              borderRadius: 8
            }}
            fallback="data:image/png;base64,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"
          />
        );
      }
    },
    {
      title: 'Producto',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.category?.name}
          </Text>
        </div>
      )
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${price?.toLocaleString()}
        </Text>
      )
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={quantity < 5 ? 'red' : quantity < 10 ? 'orange' : 'green'}>
          {quantity} unidades
        </Tag>
      )
    },
    {
      title: 'Valor Total',
      key: 'totalValue',
      render: (_, record) => (
        <Text strong>
          ${(record.price * record.quantity)?.toLocaleString()}
        </Text>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: record.name,
                content: (
                  <div>
                    <p><strong>Descripción:</strong> {record.description}</p>
                    <p><strong>Categoría:</strong> {record.category?.name}</p>
                    <p><strong>Precio:</strong> ${record.price}</p>
                    <p><strong>Stock:</strong> {record.quantity} unidades</p>
                    {record.images && record.images.length > 0 && (
                      <div>
                        <strong>Imágenes:</strong>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {record.images.map((img, idx) => (
                            <Image key={idx} width={100} height={100} src={img} style={{ objectFit: 'cover' }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ),
                width: 600
              });
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteLoading === record.id}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ 
        background: 'linear-gradient(90deg, #1890ff, #36cfc9)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '100%'
        }}>
          <Space>
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<ShopOutlined />} />
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Panel de Vendedor
            </Title>
          </Space>
          <Space>
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {user.name} {user.lastName}
            </Text>
            <Button type="primary" danger onClick={logout}>
              Cerrar Sesión
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Estadísticas */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Productos"
                  value={totalProducts}
                  prefix={<InboxOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Valor Total Inventario"
                  value={totalValue}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  formatter={(value) => `${value.toLocaleString()}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Stock Total"
                  value={totalStock}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                  suffix="unidades"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Stock Bajo"
                  value={lowStockProducts}
                  valueStyle={{ color: lowStockProducts > 0 ? '#ff4d4f' : '#52c41a' }}
                  suffix="productos"
                />
              </Card>
            </Col>
          </Row>

          {/* Tabla de productos */}
          <Card 
            title={
              <Space>
                <InboxOutlined />
                <span>Mis Productos</span>
                {products.length > 0 && (
                  <Text type="secondary">({products.length} productos)</Text>
                )}
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateProduct}
                size="large"
              >
                Nuevo Producto
              </Button>
            }
          >
            {products.length === 0 && !loading ? (
              <Empty
                description="No tienes productos creados"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateProduct}
                >
                  Crear mi primer producto
                </Button>
              </Empty>
            ) : (
              <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} de ${total} productos`
                }}
                scroll={{ x: 800 }}
              />
            )}
          </Card>
        </div>
      </Content>

      {/* Modal del formulario de producto */}
      <Modal
        title={null}
        open={showProductForm}
        onCancel={handleProductFormCancel}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <ProductForm
          product={editingProduct}
          onSuccess={handleProductFormSuccess}
          onCancel={handleProductFormCancel}
        />
      </Modal>
    </Layout>
  );
};

export default SellerDashboard;