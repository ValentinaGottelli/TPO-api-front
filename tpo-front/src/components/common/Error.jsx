import React from 'react';
import { Typography } from 'antd';
import './Error.css';

const { Text } = Typography;

const Error = ({ 
    message, 
    containerClassName = '',
    level = 'error'
}) => {
    return (
        <div className={`error-container ${containerClassName}`}>
            <Text type={level} className="error-message">
                {message}
            </Text>
        </div>
    );
};

export default Error; 