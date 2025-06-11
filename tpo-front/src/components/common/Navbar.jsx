import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

// si en un futuro agregamos searchbar, cambiar a true
const Navbar = ({ shouldShowSearchbar = false }) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleUserClick = () => {
        navigate('/');
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    return (
        <nav className="products-nav">
            {shouldShowSearchbar && (
                <form className='search-form'>
                    <input type="text" placeholder="Buscar producto" />
                </form>
            )}
            <div className={`nav-actions ${!shouldShowSearchbar ? 'nav-actions-centered' : ''}`}>
                <div className="cart-section" onClick={handleCartClick}>
                    <ShoppingCartOutlined className="cart-icon" />
                    <span className="cart-count">0</span>
                </div>
                <div className="user-section" onClick={handleUserClick}>
                    <UserOutlined className="user-icon" />
                    <span>{isAuthenticated ? `${user?.name || 'Usuario'}` : 'Ingresar'}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 