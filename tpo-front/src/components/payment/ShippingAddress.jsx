import React from 'react';
import { Card, Form, Input, Space } from 'antd';
import './Payment.css';

const ShippingAddress = ({ styles }) => {
    return (
        <Card title="Dirección de facturación" style={styles.card}>
            <Form.Item
                label="Nombre completo"
                name="fullName"
                rules={[{ required: true, message: 'Por favor ingresa tu nombre completo' }]}
            >
                <Input placeholder="Nombre y apellido" />
            </Form.Item>

            <Form.Item
                label="Dirección"
                name="address"
                rules={[{ required: true, message: 'Por favor ingresa tu dirección' }]}
            >
                <Input placeholder="Calle y número" />
            </Form.Item>

            <div className="shipping-address-row">
                <Form.Item
                    label="Ciudad"
                    name="city"
                    rules={[{ required: true, message: 'Ingresa tu ciudad' }]}
                    className="shipping-address-item"
                >
                    <Input placeholder="Ciudad" />
                </Form.Item>

                <Form.Item
                    label="Provincia/Estado"
                    name="state"
                    rules={[{ required: true, message: 'Ingresa tu provincia' }]}
                    className="shipping-address-item"
                >
                    <Input placeholder="Provincia o Estado" />
                </Form.Item>
            </div>

            <div className="shipping-address-row">
                <Form.Item
                    label="Código postal"
                    name="zipCode"
                    rules={[
                        { required: true, message: 'Ingresa tu código postal' },
                        { pattern: /^\d{4,5}$/, message: 'Código postal inválido' }
                    ]}
                    className="shipping-address-item"
                >
                    <Input placeholder="1234" />
                </Form.Item>

                <Form.Item
                    label="País"
                    name="country"
                    rules={[{ required: true, message: 'Selecciona tu país' }]}
                    className="shipping-address-item"
                >
                    <Input placeholder="País" defaultValue="Argentina" />
                </Form.Item>
            </div>
        </Card>
    );
};

export default ShippingAddress; 