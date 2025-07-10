import React from 'react';
import { Card, Space, Divider } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Payment.css';

const Summary = ({ cart, getTotalPriceCart, styles }) => {
    return (
        <Card title={
            <span>
                <ShoppingCartOutlined className="summary-title-icon" />
                Resumen de compra
            </span>
        } style={styles.card}>
            {cart && cart.length > 0 ? (
                <>
                    <Space direction="vertical" className="summary-items-container">
                        {cart.map((item) => (
                            <div key={item.id} className="summary-item">
                                <div className="summary-item-info">
                                    <div className="summary-item-name">
                                        {item.name}
                                    </div>
                                    <div className="summary-item-details">
                                        Cantidad: {item.cartQuantity} x ${item.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="summary-item-price">
                                    ${(item.cartQuantity * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </Space>

                    <Divider className="summary-divider" />

                    <div className="summary-total">
                        <span>Total:</span>
                        <span className="summary-total-price">
                            ${getTotalPriceCart().toFixed(2)}
                        </span>
                    </div>
                </>
            ) : (
                <div className="summary-empty">
                    <ShoppingCartOutlined className="summary-empty-icon" />
                    <div>No hay productos en el carrito</div>
                </div>
            )}
        </Card>
    );
};

export default Summary; 