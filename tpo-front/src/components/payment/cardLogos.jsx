import React from 'react';

// Componente del logo de Visa
export const VisaLogo = () => (
    <svg
        width="40"
        height="24"
        viewBox="0 0 40 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="visa-logo"
    >
        <rect width="40" height="24" rx="4" fill="white" />
        <rect x="1" y="1" width="38" height="22" rx="3" fill="#1A1F71" />
        <text
            x="20"
            y="15"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="0.5"
        >
            VISA
        </text>
    </svg>
);

// Componente del logo de MasterCard
export const MasterCardLogo = () => (
    <svg
        width="40"
        height="24"
        viewBox="0 0 40 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mastercard-logo"
    >
        <circle cx="13" cy="12" r="10" fill="#EB001B" />
        <circle cx="27" cy="12" r="10" fill="#F79E1B" />
        <path
            d="M20 6.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5c-1.5-1.5-2.5-3.5-2.5-5.5s1-4 2.5-5.5z"
            fill="#FF5F00"
        />
    </svg>
);

// Componente del logo de American Express
export const AmexLogo = () => (
    <svg
        width="40"
        height="24"
        viewBox="0 0 40 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="amex-logo"
    >
        <rect width="40" height="24" rx="4" fill="#006FCF" />
        <rect x="2" y="2" width="36" height="20" rx="2" fill="white" />
        <rect x="3" y="3" width="34" height="18" rx="1" fill="#006FCF" />
        <text x="20" y="15" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">
            AMEX
        </text>
    </svg>
); 