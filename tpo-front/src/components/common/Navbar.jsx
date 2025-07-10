import React from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useAuthRedux } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./Navbar.css";
import Title from "antd/es/typography/Title";


// si en un futuro agregamos searchbar, cambiar a true
const Navbar = ({ shouldShowSearchbar = false, shouldShowCart = true }) => {
  const { user, isAuthenticated } = useAuthRedux();
  const { cart, handleCartClick } = useCart();
  const navigate = useNavigate();
  const handleMarketIconClick = () => {
    navigate("/");
  };

  const handleUserClick = () => {
    navigate("/");
  };

  return (
    <nav className="products-nav">
      {shouldShowSearchbar && (
        <form className="search-form">
          <input type="text" placeholder="Buscar producto" />
        </form>
      )}
      <Title
        level={3}
        style={{ color: "black", margin: 0, cursor: "pointer" }}
        onClick={handleMarketIconClick}
      >
        🏪 Marketplace
      </Title> 
      <div
        className={`nav-actions ${
          !shouldShowSearchbar ? "nav-actions-centered" : ""
        }`}
      >
        {shouldShowCart && (
          <div className="cart-section" onClick={() => handleCartClick()}>
            <ShoppingCartOutlined className="cart-icon" />
            <span className="cart-count">{cart.length}</span>
          </div>
        )}
        <div className="user-section" onClick={handleUserClick}>
          <UserOutlined className="user-icon" />
          <span>
            {isAuthenticated ? `${user?.name || "Usuario"}` : "Ingresar"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
