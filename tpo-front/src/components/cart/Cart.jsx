import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout, Typography, Flex, Space, Button, InputNumber } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  FrownOutlined,
} from "@ant-design/icons";
const { Title } = Typography;
const { Content } = Layout;
import { useCart } from "../../hooks/useCart";
import Navbar from "../common/Navbar";

const styles = {
  dashboardLayout: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
};

export const Cart = () => {
  const {
    cart,
    totalPrice,
    addToCart,
    subtractToCart,
    updateCart,
    removeFromCart,
    loadCart,
  } = useCart();
  const navigate = useNavigate();

  // Protección para asegurar que cart siempre sea un array
  const safeCart = Array.isArray(cart) ? cart : [];

  // Cargar el carrito al montar el componente
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleFinalizarCompraClick = () => {
    navigate("/checkout");
  };
  const handleContinuarComprandoClick = () => {
    navigate("/products");
  };

  return (
    <Layout style={styles.dashboardLayout}>
      <Navbar shouldShowCart={false} />

      <Content style={{ padding: "40px 20px" }}>
        <div className="cart-container">
          <Title className="cart-title">Mi Carrito</Title>

          {safeCart.length === 0 ? (
            <div className="empty-cart">
              <Title className="empty-cart-title">
                Su carrito está vacío <FrownOutlined />
              </Title>
              <Button
                className="empty-cart-button"
                onClick={handleContinuarComprandoClick}
                size="large"
              >
                CONTINUAR COMPRANDO
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-items-container">
                {safeCart.map((c) => (
                  <div key={c.id} className="product-container">
                    <Flex gap="middle" align="center" justify="space-between">
                      <Flex gap="middle" align="center">
                        <div className="cart-image">
                          <img src={c.imageUrl} alt={c.name} />
                        </div>
                        <div className="product-info">
                          <h2 className="product-name">{c.name}</h2>
                          {c?.description && (
                            <p className="product-description">{c.description}</p>
                          )}
                          <span className="product-category">{c.category.name}</span>
                        </div>
                      </Flex>

                      <div className="cart-controls">
                        <div className="quantity-controls">
                          <Button
                            className="quantity-btn"
                            onClick={() => subtractToCart(c)}
                            icon={<MinusOutlined />}
                            size="small"
                          />
                          <InputNumber
                            className="quantity-input"
                            min={1}
                            max={c.quantity}
                            value={c.cartQuantity}
                            onChange={(value) => updateCart(c, value)}
                          />
                          <Button
                            className="quantity-btn"
                            onClick={() => addToCart(c)}
                            icon={<PlusOutlined />}
                            size="small"
                          />
                        </div>

                        <div className="cart-price">
                          ${(c.price * c.cartQuantity).toFixed(2)}
                        </div>

                        <Button
                          className="delete-btn"
                          onClick={() => removeFromCart(c)}
                          icon={<DeleteOutlined />}
                          size="small"
                        />
                      </div>
                    </Flex>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-content">
                  <div className="total-row">
                    <h2 className="total-title">Total</h2>
                    <h2 className="total-price">${totalPrice?.toFixed(2)}</h2>
                  </div>

                  <div className="cart-buttons-row">
                    <Button
                      className="continue-shopping-btn"
                      onClick={handleContinuarComprandoClick}
                      size="large"
                    >
                      CONTINUAR COMPRANDO
                    </Button>

                    <Button
                      className="checkout-btn"
                      onClick={handleFinalizarCompraClick}
                      size="large"
                    >
                      FINALIZAR COMPRA
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Cart;
