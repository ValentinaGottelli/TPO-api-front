import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/Navbar';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <>
    <Navbar shouldShowCart={false} />
    <div style={{ 
        padding: '60px 20px', 
        display: 'flex', 
        justifyContent: 'center', 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: 12, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          maxWidth: 600, 
          width: '100%',
          height: 'fit-content'
        }}>
          <Result
            status="success"
            title="¡Pago realizado con éxito!"
            subTitle="Tu compra ha sido confirmada. Te hemos enviado un correo con los detalles del pedido."
            extra={[
              <Button type="primary" onClick={handleBackHome} key="home">
                Volver al inicio
              </Button>,
            ]}
          />
        </div>
      </div>
      </>
  );
};

export default CheckoutSuccessPage;
