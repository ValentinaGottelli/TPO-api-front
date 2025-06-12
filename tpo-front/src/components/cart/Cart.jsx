import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Flex, Space, Button, InputNumber } from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  FrownOutlined,
} from "@ant-design/icons";
const { Title } = Typography;
const { Content } = Layout;
import { useCart } from "../../context/CartContext";
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
    addToCart,
    subtractToCart,
    updateCart,
    removeFromCart,
    getTotalPriceCart,
  } = useCart([]);
  const navigate = useNavigate();

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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Title>Mi carrito</Title>

          {cart.length === 0 ? (
            <Title style={{ textAlign: "center" }}>
              Su carrito está vacio <FrownOutlined />
            </Title>
          ) : (
            <>
              <Flex gap="middle" vertical>
                {cart.map((c) => {
                  return (
                    <Flex
                      key={c.id}
                      justify="space-between"
                      className="product-container"
                      style={{ minHeight: "130px" }}
                    >
                      <Flex gap="middle">
                        <Flex>
                          <div className="cart-image">
                            <img src={c.imageUrl} alt={c.name} />
                          </div>
                        </Flex>
                        <Flex vertical justify="center">
                          <h2 style={{ display: "flex" }}>{c.name}</h2>
                          {c?.description ? (
                            <h2 style={{ display: "flex" }}>{c.description}</h2>
                          ) : (
                            <></>
                          )}
                          <h3 style={{ display: "flex" }}>{c.category.name}</h3>
                        </Flex>
                      </Flex>
                      <Flex align="center" gap="middle">
                        <Button
                          onClick={() => subtractToCart(c)}
                          icon={<MinusOutlined />}
                        />
                        <InputNumber
                          min={1}
                          max={c.quantity}
                          defaultValue={c.cartQuantity}
                          onChange={(value) => updateCart(c, value)}
                          value={c.cartQuantity}
                        />
                        <Button
                          onClick={() => addToCart(c)}
                          icon={<PlusOutlined />}
                        />
                        <h3 className="cart-price">
                          $ {(c.price * c.cartQuantity).toFixed(2)}
                        </h3>

                        <Button
                          onClick={() => removeFromCart(c)}
                          icon={<DeleteOutlined />}
                          type="primary"
                          danger
                        />
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
              <Flex justify="end" style={{ marginTop: "16px" }}>
                <Flex
                  style={{
                    width: "40%",
                    backgroundColor: "aqua",
                    padding: "10px",
                  }}
                  vertical
                  gap="middle"
                >
                  <Flex justify="space-between">
                    <h2 className="total-title">Total</h2>
                    <h2 className="total-price">
                      $ {getTotalPriceCart().toFixed(2)}
                    </h2>
                  </Flex>
                  <Button
                    onClick={() => handleFinalizarCompraClick()}
                    type="primary"
                  >
                    FINALIZAR COMPRA
                  </Button>
                  <Button onClick={() => handleContinuarComprandoClick()}>
                    CONTINUAR COMPRANDO
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Cart;
