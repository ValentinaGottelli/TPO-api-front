import React, { useState } from 'react';
import { Card, Form, Input, Space } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { VisaLogo, MasterCardLogo, AmexLogo } from './cardLogos';
import './Payment.css';

const CreditCard = ({ paymentMethod, form, styles }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

    // Función para detectar el tipo de tarjeta y obtener el color
    const getCardTypeAndColor = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) {
            return { type: 'Visa', color: 'linear-gradient(135deg, #1a237e, #3949ab)' };
        } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
            return { type: 'MasterCard', color: 'linear-gradient(135deg, #d32f2f, #f44336)' };
        } else if (cleanNumber.startsWith('3')) {
            return { type: 'Amex', color: 'linear-gradient(135deg, #00695c, #26a69a)' };
        } else if (cleanNumber.length > 0) {
            return { type: 'Unknown', color: 'linear-gradient(135deg, #424242, #757575)' };
        }
        return { type: '', color: 'linear-gradient(135deg, #e0e0e0, #bdbdbd)' };
    };

    // Función para formatear el número de tarjeta
    const formatCardNumber = (number) => {
        const cleaned = number.replace(/\s/g, '');
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        return formatted;
    };

    if (paymentMethod !== 'credit-card') {
        return null;
    }

    const cardTypeAndColor = getCardTypeAndColor(cardNumber);

    return (
        <>
            {/* Tarjeta visual con efecto de volteo */}
            <div className="credit-card-container">
                <div className={`credit-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
                    {/* Frente de la tarjeta */}
                    <div
                        className="credit-card-front"
                        style={{ background: cardTypeAndColor.color }}
                    >
                        <div className="credit-card-header">
                            <div className="credit-card-type">
                                {cardTypeAndColor.type || 'TARJETA'}
                            </div>
                            <div className="credit-card-chip"></div>
                            {/* Logos de tarjetas en la esquina superior derecha */}
                            {cardTypeAndColor.type === 'Visa' && (
                                <div className="credit-card-logo">
                                    <VisaLogo />
                                </div>
                            )}
                            {cardTypeAndColor.type === 'MasterCard' && (
                                <div className="credit-card-logo">
                                    <MasterCardLogo />
                                </div>
                            )}
                            {cardTypeAndColor.type === 'Amex' && (
                                <div className="credit-card-logo">
                                    <AmexLogo />
                                </div>
                            )}
                        </div>

                        <div className="credit-card-number">
                            {formatCardNumber(cardNumber) || '•••• •••• •••• ••••'}
                        </div>

                        <div className="credit-card-info">
                            <div>
                                <div className="credit-card-holder">TITULAR</div>
                                <div className="credit-card-holder-name">
                                    {cardName || 'NOMBRE APELLIDO'}
                                </div>
                            </div>
                            <div>
                                <div className="credit-card-expiry">VENCE</div>
                                <div className="credit-card-expiry-date">
                                    {cardExpiry || 'MM/AA'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dorso de la tarjeta */}
                    <div
                        className="credit-card-back"
                        style={{ background: cardTypeAndColor.color }}
                    >
                        {/* Banda magnética */}
                        <div className="credit-card-magnetic-strip"></div>

                        {/* Área del CVV */}
                        <div className="credit-card-cvv-area">
                            <div className="credit-card-cvv-box">
                                {cardCvv || '•••'}
                            </div>
                        </div>

                        {/* Número parcial y firma */}
                        <div className="credit-card-back-info">
                            <div className="credit-card-partial-number">
                                {cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : '•••• •••• •••• ••••'}
                            </div>
                            <div className="credit-card-signature">
                                FIRMA
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Card title="Detalles de la tarjeta" style={styles.card}>
                <Form.Item
                    label="Número de tarjeta"
                    name="cardNumber"
                    validateTrigger="onBlur"
                    rules={[
                        { required: true, message: 'Por favor ingresa el número de tarjeta' },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.reject();
                                const cleanValue = value.replace(/\s/g, '');
                                if (cleanValue.length !== 16 || !/^\d+$/.test(cleanValue)) {
                                    return Promise.reject(new Error('El número de tarjeta debe tener 16 dígitos'));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        prefix={<CreditCardOutlined />}
                        value={cardNumber}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCardNumber(value);
                            form.setFieldsValue({ cardNumber: value });
                        }}
                    />
                </Form.Item>

                <div className="credit-card-form-row">
                    <Form.Item
                        label="Fecha de vencimiento"
                        name="expiryDate"
                        validateTrigger="onBlur"
                        rules={[
                            { required: true, message: 'Ingresa la fecha de vencimiento' },
                            { pattern: /^\d{2}\/\d{2}$/, message: 'Formato: MM/AA' }
                        ]}
                        style={{ flex: 1 }}
                    >
                        <Input
                            placeholder="MM/AA"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                                setCardExpiry(value);
                                form.setFieldsValue({ expiryDate: value });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="CVV"
                        name="cvv"
                        validateTrigger="onBlur"
                        rules={[
                            { required: true, message: 'Ingresa el CVV' },
                            { pattern: /^\d{3,4}$/, message: 'CVV debe tener 3 o 4 dígitos' }
                        ]}
                        style={{ flex: 1 }}
                    >
                        <Input
                            placeholder="123"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setCardCvv(value);
                                form.setFieldsValue({ cvv: value });
                            }}
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Nombre en la tarjeta"
                    name="cardholderName"
                    validateTrigger="onBlur"
                    rules={[
                        { required: true, message: 'Ingresa el nombre del titular' },
                        { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'El nombre solo puede contener letras y espacios' }
                    ]}
                >
                    <Input
                        placeholder="Nombre completo"
                        value={cardName}
                        onChange={(e) => {
                            // Solo permitir letras, espacios y caracteres especiales (acentos, ñ, etc.)
                            const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toUpperCase();
                            setCardName(value);
                            form.setFieldsValue({ cardholderName: value });
                        }}
                    />
                </Form.Item>
            </Card>
        </>
    );
};

export default CreditCard; 
