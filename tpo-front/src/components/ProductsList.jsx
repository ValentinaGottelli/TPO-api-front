import "./ProductsList.css";
import { useNavigate } from "react-router-dom";
import { Pagination, Button } from "antd";
import { useState, useEffect } from "react";
import Navbar from "./common/Navbar";
import Categories from "./common/Categories";
import Error from "./common/Error";
import productService from "../services/productService";
import LoadingScreen from "./common/LoadingScreen";
import CartDrawer from "./cartDrawer/cartDrawer";
import { useCart } from "../hooks/useCart";

export const ProductsList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();
  const productsPerPage = 10;

  const loadProducts = async (categoryId = null) => {
    try {
      setLoading(true);
      const products = await (categoryId
        ? productService.getProductsByCategory(categoryId)
        : productService.getAllProducts());

      // Paginación (podríamos implementarlo en el backend más adelante)
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginatedProducts = products.slice(startIndex, endIndex);

      setProducts(paginatedProducts);
      setTotal(products.length);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [currentPage, productsPerPage, selectedCategory]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPage(1); // Reset a la primera página cuando cambia la categoría
  };



  if (loading) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <Categories
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
        <LoadingScreen />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <Categories
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
        <Error message={error} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Categories
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
      />
      <div className="products-grid">
        {products
          .filter((product) => product.quantity > 0)
          .map((product) => (
            <div
              key={product.id}
              className="product-card"
            >
              <div className="product-card-content" onClick={() => handleProductClick(product.id)}>
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <h2>{product.name}</h2>
                <div className="price">${product.price.toFixed(2)}</div>
                <div className="category">{product.category.name}</div>
                <div className="quantity">
                  Stock disponible: {product.quantity}
                </div>
              </div>

              <div className="add-to-cart-container">
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => addToCart(product)}
                  style={{
                    backgroundColor: '#b19cd9',
                    borderColor: '#b19cd9',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#a084d1';
                    e.target.style.borderColor = '#a084d1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#b19cd9';
                    e.target.style.borderColor = '#b19cd9';
                  }}
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={productsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

export default ProductsList;
