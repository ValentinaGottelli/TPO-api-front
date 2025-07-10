import React, { useState } from 'react';
import { Layout, Form, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import useCheckoutRedux from '../checkout/useCheckout';
import { useNotification } from '../../../hooks/useNotification';
import PaymentMethod from './PaymentMethod';
import ShippingAddress from './ShippingAddress';
import Summary from './Summary';
import ConfirmButton from './ConfirmButton';
import CreditCard from './CreditCard';
import CashMethod from './CashMethod';
import Navbar from '../../common/Navbar';
import './Payment.css';

const { Content } = Layout;

const styles = {
    card: {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
};

const Payment = () => {
    const navigate = useNavigate();
    const { cart, getTotalPriceCart, loadCart } = useCart();
    const { confirmCheckout } = useCheckoutRedux();
    const { toast } = useNotification();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            if (paymentMethod === 'credit-card') {
                const cardNumber = values.cardNumber?.replace(/\s/g, '');

                // Simular error si la tarjeta es todos ceros
                if (cardNumber === '0000000000000000') {
                    throw new Error('CARD_DECLINED');
                }
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            const checkoutResult = await confirmCheckout();

            if (checkoutResult) {
                // Refrescamos el carrito local para sincronizar con el backend (ahora vacío)
                await loadCart();

                if (paymentMethod === 'credit-card') {
                    message.success('¡Pago procesado exitosamente! Tu carrito ha sido limpiado.');
                } else {
                    message.success('¡Pedido confirmado! El pago se realizará en efectivo al momento de la entrega. Tu carrito ha sido limpiado.');
                }

                // Redirigir al checkout de éxito
                console.log('✅ Navegando a /checkout/success');
                navigate('/checkout/success');
            } else {
                throw new Error('Error al procesar el checkout');
            }
        } catch (error) {
            if (error.message === 'CARD_DECLINED') {
                // Solo se muestra el toast de error y el usuario puede intentar de nuevo
                toast({
                    message: '🚫 Tarjeta Declinada',
                    description: 'Ocurrió un error al procesar el pago. Por favor: • Verifica que hayas ingresado el número correctamente • Usa una tarjeta diferente • Contacta a tu banco si el problema persiste',
                    placement: 'topRight'
                });
            } else {
                // OTROS ERRORES: También preservan el carrito
                const errorMessage = paymentMethod === 'credit-card'
                    ? 'Error al procesar el pago. Intenta nuevamente.'
                    : 'Error al confirmar el pedido. Intenta nuevamente.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/checkout');
    };

    return (
        <Layout className="payment-layout">
            <Navbar shouldShowCart={false} />
            <Content className="payment-content">
                <div className="payment-container">
                    {/* Formulario completo */}
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Row gutter={24}>
                            {/* Columna izquierda - Formularios */}
                            <Col xs={24} lg={14}>

                                {/* Detalles del método de pago */}
                                <CreditCard
                                    paymentMethod={paymentMethod}
                                    form={form}
                                    styles={styles}
                                />

                                <CashMethod
                                    paymentMethod={paymentMethod}
                                    styles={styles}
                                />
                                {/* Dirección de facturación */}
                                <ShippingAddress styles={styles} />

                            </Col>

                            {/* Columna derecha - Método de pago */}
                            <Col xs={24} lg={10}>
                                {/* Método de pago */}
                                <PaymentMethod
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                    styles={styles}
                                />
                                {/* Resumen de compra */}
                                <Summary
                                    cart={cart}
                                    getTotalPriceCart={getTotalPriceCart}
                                    styles={styles}
                                />
                                {/* Botones de acción */}
                                <ConfirmButton
                                    paymentMethod={paymentMethod}
                                    loading={loading}
                                    handleGoBack={handleGoBack}
                                    handleSubmit={handleSubmit}
                                    form={form}
                                    styles={styles}
                                    cartEmpty={!cart || cart.length === 0}
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default Payment; 