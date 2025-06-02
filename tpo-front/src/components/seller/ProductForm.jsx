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
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  PictureOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';

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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    loadCategories();
    if (product) {
      // Si estamos editando, cargar datos del producto
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categoryId: product.category?.id
      });
      
      // Si el producto tiene imágenes, cargarlas
      if (product.images && product.images.length > 0) {
        setImageUrls(product.images);
      }
    }
  }, [product, form]);

  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      message.error('Error al cargar categorías: ' + error.message);
      // Categorías por defecto si falla la carga
      setCategories([
        { id: 1, name: 'Maquillaje' },
        { id: 2, name: 'Electrónicos' },
        { id: 3, name: 'Ropa' },
        { id: 4, name: 'Hogar' }
      ]);
    }
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);
    try {
      const imageResponse = await productService.uploadImage(file);
      
      if (imageResponse && imageResponse.url) {
        setUploadedImages(prev => [...prev, imageResponse.url]);
        setImageUrls(prev => [...prev, imageResponse.url]);
        message.success('Imagen subida exitosamente');
      }
    } catch (error) {
      message.error('Error al subir imagen: ' + error.message);
    } finally {
      setImageLoading(false);
    }
    
    return false; // Prevent default upload behavior
  };

  const removeImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    if (imageUrls.length === 0) {
      message.warning('Por favor sube al menos una imagen del producto');
      return;
    }

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
        userId: user.id,
        images: imageUrls
      };

      let result;
      if (product) {
        // Actualizar producto existente
        result = await productService.updateProduct(product.id, productData);
        message.success('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        result = await productService.createProduct(productData);
        message.success('Producto creado exitosamente');
      }

      form.resetFields();
      setImageUrls([]);
      setUploadedImages([]);
      
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

            <Form.Item label="Imágenes del Producto">
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
            </Form.Item>

            {imageUrls.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Imágenes subidas:</Text>
                <div style={{ 
                  display: 'flex', 
                  gap: 8, 
                  flexWrap: 'wrap', 
                  marginTop: 8 
                }}>
                  {imageUrls.map((url, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <Image
                        width={80}
                        height={80}
                        src={url}
                        style={{ 
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #d9d9d9'
                        }}
                        fallback="data:image/png;base64,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"
                      />
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeImage(index)}
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
                  ))}
                </div>
              </div>
            )}
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