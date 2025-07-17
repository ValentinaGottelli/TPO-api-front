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
  Tag,
  Image,
  Popconfirm,
  Empty,
  Avatar,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  DollarOutlined,
  InboxOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuthRedux } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import ProductForm from './ProductForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductListByUser } from '../../store/slices/productsSlice';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { user, logout, loading: authLoading } = useAuthRedux();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const productList = useSelector(state => state.products.products)

  useEffect(() => {
    dispatch(fetchproductListByUser(user.id))
  }, [dispatch])

  console.log(productList)
  useEffect(() => {
    if (user && user.id) {
      loadUserProducts();
    }
  }, [user]);

  const loadUserProducts = async () => {
    if (!user || !user.id) {
      console.error('No user ID available');
      return;
    }

    setLoading(true);
    try {
      const userProducts = await productService.getUserProducts(user.id);
      setProducts(userProducts || []);
    } catch (error) {
      toast.error('Error al cargar productos: ' + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    if (!user || !user.id) {
      toast.error('Error: Usuario no autenticado', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setDeleteLoading(productId);
    try {
      await productService.deleteProduct(productId, user.id);
      toast.success('¡Producto eliminado exitosamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      await loadUserProducts();
    } catch (error) {
      toast.error('Error al eliminar producto: ' + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleProductFormSuccess = async (result) => {
    setShowProductForm(false);
    setEditingProduct(null);
    
    // Toast personalizado según si fue creación o edición
    if (editingProduct) {
      toast.success('¡Producto actualizado exitosamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.success('¡Producto creado exitosamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    await loadUserProducts();
  };

  const handleProductFormCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    try {
      toast.info('Cerrando sesión...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/auth';
    }
  };

  // Mostrar loading si el usuario aún se está cargando
  if (authLoading || !user) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Space direction="vertical" align="center">
            <Spin size="large" />
            <Text>Cargando datos del usuario...</Text>
          </Space>
        </div>
      </Layout>
    );
  }

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity < 5).length;

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl) => (
        <Image
          width={60}
          height={60}
          src={imageUrl}
          style={{ 
            objectFit: 'cover',
            borderRadius: 8
          }}
        />
      )
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
            <Button type="primary" danger onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
                  formatter={(value) => `$${value.toLocaleString()}`}
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
            {productList.length === 0 && !loading ? (
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
                dataSource={productList}
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