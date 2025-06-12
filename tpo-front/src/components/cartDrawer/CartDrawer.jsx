import { useCart } from "../../context/CartContext";
import { Space, Button, Drawer, Flex, Typography } from "antd";
const { Title } = Typography;

import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const CartDrawer = () => {
  const {
    cart,
    cartDrawer,
    handleCartClick,
    addToCart,
    subtractToCart,
    removeFromCart,
  } = useCart([]);
  const navigate = useNavigate();

  const onChange = (value) => {
    console.log("changed", value);
  };

  const navigateToCart = () => {
    navigate("/cart");
  };

  return (
    <>
      <Drawer
        title="Cart"
        closable={{ "aria-label": "Close Button" }}
        onClose={handleCartClick}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={navigateToCart}
              disabled={!cart.length}
            >
              Ir a mi Carrito
            </Button>
          </Space>
        }
        open={cartDrawer}
      >
        <Flex gap="middle" vertical>
          {cart.length === 0 ? (
            <Title style={{ textAlign: "center" }}>
              Su carrito está vacio <FrownOutlined />
            </Title>
          ) : (
            cart.map((c) => {
              return (
                <Flex justify="space-between" align="center" key={c.id}>
                  <Flex align="center">{c.name}</Flex>
                  <Flex gap="middle" align="center">
                    <Button
                      onClick={() => subtractToCart(c)}
                      icon={<MinusOutlined />}
                    />
                    {c.cartQuantity}
                    <Button
                      onClick={() => addToCart(c)}
                      icon={<PlusOutlined />}
                    />
                    <Button
                      onClick={() => removeFromCart(c)}
                      icon={<DeleteOutlined />}
                      type="primary"
                      danger
                    />
                  </Flex>
                </Flex>
              );
            })
          )}
        </Flex>
      </Drawer>
    </>
  );
};

export default CartDrawer;
