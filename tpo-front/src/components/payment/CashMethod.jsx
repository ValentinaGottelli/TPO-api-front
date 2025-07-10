import React from 'react';
import { Card } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import './Payment.css';

const CashMethod = ({ paymentMethod, styles }) => {
    if (paymentMethod !== 'cash') {
        return null;
    }

    return (
        <Card title="Detalles del pago en efectivo" style={styles.card}>
            <div className="cash-method-container">
                <div className="cash-method-header">
                    <DollarOutlined className="cash-method-icon" />
                    <span className="cash-method-title">Pago en Efectivo - Contra Entrega</span>
                </div>
                <div className="cash-method-content">
                    <p className="cash-method-item">
                        • El pago se realizará en efectivo al momento de la entrega
                    </p>
                    <p className="cash-method-item">
                        • No se requiere información de tarjeta de crédito
                    </p>
                    <p className="cash-method-item">
                        • Asegúrate de tener el monto exacto disponible
                    </p>
                    <p className="cash-method-item">
                        • El repartidor confirmará la entrega una vez recibido el pago
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CashMethod; 