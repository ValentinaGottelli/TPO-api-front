import React, { useEffect } from "react";
import {
  Layout,
  Card,
  Typography,
  Table,
  Button,
  Row,
  Col,
  Space,
  Divider,
  Descriptions,
  message,
} from "antd";
import { ShoppingCartOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useCheckoutRedux } from "../checkout/useCheckout";
import { useGetCartRedux } from "./useGetCart";
import { useNavigate } from "react-router-dom";
import { useAuthRedux } from "../../../hooks/useAuth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const styles = {
  layout: {
    minHeight: "100vh",
    background: "#f0f2f5",
  },
  header: {
    background: "#1890ff",
    padding: "0 20px",
  },
  card: {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};

const CheckoutPage = () => {
  const { user } = useAuthRedux();
  const { confirmCheckout, loading, error, response } = useCheckoutRedux();
  const { cart, prodError } = useGetCartRedux();
  const navigate = useNavigate();

  useEffect(() => {
    if (error || prodError) {
      message.error(error.message || "Ocurrió un error inesperado");
    }
  }, [error, prodError]);

  const handleCheckout = async () => {
    const result = await confirmCheckout();
    if (result) {
      navigate("/checkout/success");
    } else if (error) {
      console.error("ERROR DEL CHECKOUT", error);
      message.error("Ocurrió un error");
    }
  };

  const navHome = () => {
    navigate("/cart");
  };

  return (
    <Layout style={styles.layout}>
      <Header style={styles.header}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          <ShoppingCartOutlined /> Checkout
        </Title>
      </Header>

      <Content style={{ padding: "40px 20px" }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} lg={16}>
            <Card title="Resumen de tu carrito" style={styles.card}>
              {cart?.products?.length > 0 ? (
                cart.products.map((prodItem) => (
                  <ProductRow
                    key={prodItem.product.id}
                    cartProduct={prodItem}
                  />
                ))
              ) : (
                <p>No hay poroductos</p>
              )}
              <div style={{ textAlign: "right" }}>
                <Title level={4}>Total: ${cart ? cart.total : 0}</Title>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Datos del comprador" style={styles.card}>
              <Descriptions column={1}>
                <Descriptions.Item label="Nombre">
                  {user?.name} {user?.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user?.email}
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <Space direction="vertical" style={{ width: "100%" }}>
                {cart?.products?.length > 0 ? (
                  <Button
                    type="primary"
                    icon={<CreditCardOutlined />}
                    size="large"
                    block
                    disabled={loading}
                    onClick={handleCheckout}
                  >
                    Confirmar Pago
                  </Button>
                ) : (
                  <></>
                )}

                <Button onClick={navHome} block>
                  Volver al carrito
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CheckoutPage;

const ProductRow = ({ cartProduct }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 8,
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <img
      src={cartProduct.product.imageUrl}
      alt={cartProduct.product.name}
      style={{
        width: 64,
        height: 64,
        objectFit: "contain",
        borderRadius: 8,
        marginRight: 16,
      }}
    />
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 16 }}>
        {cartProduct.product.name}
      </div>
      <div style={{ color: "#888", fontSize: 14 }}>
        {cartProduct.product.category.name}
      </div>
      <div style={{ marginTop: 4, fontSize: 14 }}>
        Cantidad: {cartProduct.quantity} x $
        {cartProduct.product.price.toFixed(2)}
      </div>
    </div>
    <div style={{ fontWeight: 700, fontSize: 16 }}>
      ${(cartProduct.quantity * cartProduct.product.price).toFixed(2)}
    </div>
  </div>
);
