import React from 'react';
import { Card, Typography, Spin } from 'antd';

const { Text } = Typography;

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loadingCard: {
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
  }
};

function LoadingScreen() {
  return (
    <div style={styles.loadingContainer}>
      <Card style={styles.loadingCard}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Cargando...</Text>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LoadingScreen;