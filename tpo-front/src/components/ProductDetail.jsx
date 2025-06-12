import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Image, Typography, Button, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import productService from "../services/productService";
import Navbar from "./common/Navbar";
import Error from "./common/Error";
import "./ProductDetail.css";
import LoadingScreen from "./common/LoadingScreen";
import CartDrawer from "./cartDrawer/cartDrawer";
import { useCart } from "../context/CartContext";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response);
      } catch (error) {
        console.error("Error loading product:", error);
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <LoadingScreen />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <div className="product-detail-container">
          <Error
            message={error || "Producto no encontrado"}
            level={!product ? "warning" : "error"}
          />
          <Button type="primary" onClick={() => navigate("/products")}>
            Volver a productos
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="product-detail-container">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/products")}
          className="back-button"
        >
          Volver a productos
        </Button>

        <Card className="product-card">
          <div className="product-content">
            <div className="product-image-container">
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            </div>

            <div className="product-info">
              <Title level={2} className="product-title">
                {product.name}
              </Title>

              <div className="product-category">
                <Tag color="blue">{product.category.name}</Tag>
              </div>

              <Title level={3} type="success" className="product-price">
                ${product.price.toFixed(2)}
              </Title>

              {product.description && (
                <Text className="product-description">
                  {product.description}
                </Text>
              )}

              <Text className="product-stock">
                Stock disponible: {product.quantity} unidades
              </Text>

              <div className="add-to-cart-container">
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => addToCart(product)}
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProductDetail;
