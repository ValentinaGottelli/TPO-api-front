import React from 'react';
import { Card, Space } from 'antd';
import { CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import './Payment.css';

const PaymentMethod = ({ paymentMethod, setPaymentMethod, styles }) => {
    return (
        <Card title="Método de pago" style={styles.card}>
            <Space direction="vertical" className="payment-method-container">
                <div
                    onClick={() => setPaymentMethod('credit-card')}
                    className={`payment-method-option ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                >
                    <CreditCardOutlined className="payment-method-icon-credit" />
                    <div>
                        <div className="payment-method-title">Tarjeta de Crédito/Débito</div>
                        <div className="payment-method-subtitle">
                            Visa, MasterCard, American Express
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`payment-method-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                >
                    <DollarOutlined className="payment-method-icon-cash" />
                    <div>
                        <div className="payment-method-title">Efectivo</div>
                        <div className="payment-method-subtitle">
                            Pago en efectivo contra entrega
                        </div>
                    </div>
                </div>
            </Space>
        </Card>
    );
};

export default PaymentMethod; 