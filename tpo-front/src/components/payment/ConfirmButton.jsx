import React from 'react';
import { Card, Button, Space, Form } from 'antd';
import { CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { useNotification } from '../../hooks/useNotification';
import './Payment.css';

const ConfirmButton = ({ paymentMethod, loading, handleGoBack, handleSubmit, form, styles, cartEmpty }) => {
    const { toast } = useNotification();
    
    const handleClick = async () => {
        if (cartEmpty) return;

        try {
            const values = await form.validateFields();
            await handleSubmit(values);
        } catch (error) {
            console.error('Error en validación del formulario:', error);
            // Mostrar toast cuando falle la validación
            toast({
                message: "Por favor completa toda la información",
                description: "Revisa que todos los campos obligatorios estén completos antes de continuar."
            });
        }
    };

    return (
        <Card style={styles.card}>
            <Form.Item style={{ marginBottom: 0 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        onClick={handleClick}
                        loading={loading}
                        size="large"
                        block
                        disabled={cartEmpty}
                        icon={paymentMethod === 'credit-card' ? <CreditCardOutlined /> : <DollarOutlined />}
                    >
                        {loading ? 'Procesando...' :
                            cartEmpty ? 'Carrito vacío' :
                                paymentMethod === 'credit-card' ? 'Procesar Pago' : 'Confirmar Pedido'}
                    </Button>
                    <Button onClick={handleGoBack} block>
                        Cancelar
                    </Button>
                    {cartEmpty && (
                        <div className="cart-empty-message">
                            Agrega productos al carrito para continuar
                        </div>
                    )}
                </Space>
            </Form.Item>
        </Card>
    );
};

export default ConfirmButton; 
