import './ProductsList.css';
import { useAuth } from '../../context/AuthContext';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import { useState } from 'react';

const mockProducts = [
    {
        id: 1,
        name: "iPhone 13",
        price: 999.99,
        quantity: 10,
        imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-blue?wid=500&hei=500&fmt=jpeg&qlt=95&.v=1656712888128",
        category: {
            id: 1,
            name: "Electrónica"
        }
    },
    {
        id: 2,
        name: "Samsung TV 55\"",
        price: 799.99,
        quantity: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71LJJrKbezL._AC_SX679_.jpg",
        category: {
            id: 1,
            name: "Electrónica"
        }
    },
    {
        id: 3,
        name: "Remera Nike",
        price: 29.99,
        quantity: 50,
        imageUrl: "https://nikearprod.vtexassets.com/arquivos/ids/453775-800-800?v=638144399277770000&width=800&height=800&aspect=true",
        category: {
            id: 2,
            name: "Ropa"
        }
    },
    {
        id: 4,
        name: "PlayStation 5",
        price: 499.99,
        quantity: 3,
        imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
        category: {
            id: 1,
            name: "Electrónica"
        }
    },
    {
        id: 5,
        name: "Zapatillas Adidas Running",
        price: 89.99,
        quantity: 15,
        imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/09c5ea6df1bd4be6baaaac5e003e7047_9366/Zapatillas_Galaxy_6_Negro_FT8975_01_standard.jpg",
        category: {
            id: 4,
            name: "Deportes"
        }
    },
    {
        id: 6,
        name: "Set de Jardín",
        price: 299.99,
        quantity: 8,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvE7YHQOELgPBJT-6TDpQ_IJJJEqbz2YmsCA&s",
        category: {
            id: 7,
            name: "Jardín"
        }
    },
    {
        id: 7,
        name: "Aspiradora Robot",
        price: 199.99,
        quantity: 12,
        imageUrl: "https://electroluxar.vtexassets.com/arquivos/ids/163061/1.jpg?v=638385040855430000",
        category: {
            id: 3,
            name: "Hogar"
        }
    },
    {
        id: 8,
        name: "Libro Harry Potter Saga Completa",
        price: 99.99,
        quantity: 20,
        imageUrl: "https://contentv2.tap-commerce.com/cover/large/9789878000473_1.jpg?id_com=1113",
        category: {
            id: 6,
            name: "Libros"
        }
    },
    {
        id: 9,
        name: "Cama para Mascota",
        price: 45.99,
        quantity: 25,
        imageUrl: "https://puppis.vteximg.com.br/arquivos/ids/183385-1000-1000/7798002580134-1.jpg",
        category: {
            id: 9,
            name: "Mascotas"
        }
    },
    {
        id: 10,
        name: "Set de Maquillaje Profesional",
        price: 79.99,
        quantity: 18,
        imageUrl: "https://juleriaque.vteximg.com.br/arquivos/ids/182366-1000-1000/set-de-brochas-morphe-complexion-crew-5-piece-brush-collection-1.jpg",
        category: {
            id: 10,
            name: "Belleza"
        }
    },
    {
        id: 11,
        name: "Batería de Auto",
        price: 129.99,
        quantity: 10,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmC4830CK0Jc0-sQUoasWfoolO1FfmN4Qkfw&s",
        category: {
            id: 8,
            name: "Automotor"
        }
    },
    {
        id: 12,
        name: "Set de Juguetes Educativos",
        price: 39.99,
        quantity: 30,
        imageUrl: "https://http2.mlstatic.com/D_NQ_910291-MLU75751911352_042024-V.webp",
        category: {
            id: 5,
            name: "Juguetes"
        }
    }
];

const mockCategories = [
    {
        id: 1,
        name: "Electrónica"
    },
    {
        id: 2,
        name: "Ropa"
    },
    {
        id: 3,
        name: "Hogar"
    },
    {
        id: 4,
        name: "Deportes"
    },
    {
        id: 5,
        name: "Juguetes"
    },
    {
        id: 6,
        name: "Libros"
    },
    {
        id: 7,
        name: "Jardín"
    },
    {
        id: 8,
        name: "Automotor"
    },
    {
        id: 9,
        name: "Mascotas"
    },
    {
        id: 10,
        name: "Belleza"
    }
];

export const ProductsList = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const handleUserClick = () => {
        navigate(isAuthenticated ? '/profile' : '/auth');
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    // Calcular productos para la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = mockProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Opcional: hacer scroll al inicio de la lista
        window.scrollTo(0, 0);
    };

    return (
        <>
        <nav className="products-nav">
            <form className='search-form'>
                <input type="text" placeholder="Buscar producto" />
            </form>
            <div className="nav-actions">
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
        <div className="categories-container">
            {mockCategories.map(e => (
                <button key={e.id}>
                    <h1>{e.name}</h1>
                </button>
            ))}
        </div>
        <div className="products-grid">
            {currentProducts.map(product => (
                <div key={product.id} className="product-card">
                    <div className="product-image">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <h2>{product.name}</h2>
                    <div className="price">${product.price.toFixed(2)}</div>
                    <div className="category">{product.category.name}</div>
                    <div className="quantity">Stock disponible: {product.quantity}</div>
                </div>
            ))}
        </div>
        <div className="pagination-container">
            <Pagination
                current={currentPage}
                total={mockProducts.length}
                pageSize={productsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
            />
        </div>
        </>
    );
};

export default ProductsList;