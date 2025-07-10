import "./CartDrawer.css";
import { useEffect } from "react";
import { useCart } from "../../hooks/useCart";
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
    loadCart,
  } = useCart();
  const navigate = useNavigate();

  const navigateToCart = () => {
    navigate("/cart");
    handleCartClick();
  };

  useEffect(() => {
    loadCart();
  }, []);

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
                <Flex align="center" key={c.id} gap="small">
                  <Flex>
                    <div className="cart-image-drawer">
                      <img src={c.imageUrl} alt={c.name} />
                    </div>
                  </Flex>
                  <Flex vertical gap="small" className="flex-grow">
                    <Flex align="center">{c.name}</Flex>
                    <Flex gap="small" align="center">
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
                    <h2>$ {(c.price * c.cartQuantity).toFixed(2)}</h2>
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
