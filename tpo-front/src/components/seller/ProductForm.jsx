import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Card,
  Space,
  Typography,
  message,
  Row,
  Col,
  Image,
  Spin
} from 'antd';
import {
  DeleteOutlined,
  SaveOutlined,
  PictureOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const ProductForm = ({ product = null, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadCategories();
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categoryId: product.category?.id
      });
      
      if (product.imageUrl) {
        setImageUrl(product.imageUrl);
      }
    }
  }, [product, form]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      message.error('Error al cargar categorías: ' + error.message);
      setCategories([]);
    }
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);
    try {
      const imageResponse = await productService.uploadImage(file);
      
      if (imageResponse && imageResponse.imageUrl) {
        setImageUrl(imageResponse.imageUrl);
        message.success('Imagen subida exitosamente');
      }
    } catch (error) {
      message.error('Error al subir imagen: ' + error.message);
    } finally {
      setImageLoading(false);
    }
    
    return false;
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedCategory = categories.find(cat => cat.id === values.categoryId);
      
      const productData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        quantity: parseInt(values.quantity),
        category: {
          id: values.categoryId,
          name: selectedCategory?.name || ''
        },
        userId: user.id
      };

      if (imageUrl) {
        productData.imageUrl = imageUrl;
      }

      let result;
      if (product) {
        result = await productService.updateProduct(product.id, productData);
        message.success('Producto actualizado exitosamente');
      } else {
        result = await productService.createProduct(productData);
        message.success('Producto creado exitosamente');
      }

      form.resetFields();
      setImageUrl('');
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      message.error('Error al guardar producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'image',
    multiple: false,
    accept: 'image/*',
    beforeUpload: handleImageUpload,
    showUploadList: false,
  };

  return (
    <Card 
      title={
        <Space>
          <PictureOutlined />
          <Title level={4} style={{ margin: 0 }}>
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </Title>
        </Space>
      }
      extra={
        onCancel && (
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        )
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nombre del Producto"
              name="name"
              rules={[
                { required: true, message: 'Por favor ingresa el nombre del producto' },
                { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
              ]}
            >
              <Input 
                placeholder="Ej: iPhone 15 Pro Max"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Precio"
              name="price"
              rules={[
                { required: true, message: 'Por favor ingresa el precio' },
                { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="large"
                min={0}
                step={0.01}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              label="Cantidad en Stock"
              name="quantity"
              rules={[
                { required: true, message: 'Por favor ingresa la cantidad' },
                { type: 'number', min: 1, message: 'La cantidad debe ser mayor a 0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="large"
                min={1}
                placeholder="10"
              />
            </Form.Item>

            <Form.Item
              label="Categoría"
              name="categoryId"
              rules={[{ required: true, message: 'Por favor selecciona una categoría' }]}
            >
              <Select
                size="large"
                placeholder="Selecciona una categoría"
                loading={categories.length === 0}
              >
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Descripción"
              name="description"
              rules={[
                { required: true, message: 'Por favor ingresa una descripción' },
                { min: 10, message: 'La descripción debe tener al menos 10 caracteres' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Describe tu producto detalladamente..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item label="Imagen del Producto (Opcional)">
              {!imageUrl ? (
                <Dragger {...uploadProps} disabled={imageLoading}>
                  <p className="ant-upload-drag-icon">
                    {imageLoading ? <Spin /> : <InboxOutlined />}
                  </p>
                  <p className="ant-upload-text">
                    {imageLoading ? 'Subiendo imagen...' : 'Haz clic o arrastra una imagen aquí'}
                  </p>
                  <p className="ant-upload-hint">
                    Formatos: JPG, PNG, GIF. Máximo 10MB
                  </p>
                </Dragger>
              ) : (
                <div>
                  <Text strong>Imagen subida:</Text>
                  <div style={{ 
                    marginTop: 8,
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    <Image
                      width={200}
                      height={150}
                      src={imageUrl}
                      style={{ 
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #d9d9d9'
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={removeImage}
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      type="dashed" 
                      onClick={() => setImageUrl('')}
                      disabled={imageLoading}
                    >
                      Cambiar imagen
                    </Button>
                  </div>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 24 }}>
          <Space>
            {onCancel && (
              <Button size="large" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {product ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
};

export default ProductForm;