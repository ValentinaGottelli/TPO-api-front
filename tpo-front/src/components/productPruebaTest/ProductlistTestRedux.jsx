import { useEffect, useState } from "react"
import listaProductosTest from "../../services/pruebaProductos/listaProductosTest";
import { Card } from 'antd';
import { Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsListTest } from "../../store/slices/productsSlice";
const { Meta } = Card;

export const ProductlistTestRedux = () => {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.products.products);
    const loading = useSelector(state => state.products.loading);
    const error = useSelector(state => state.products.error);

    useEffect(() => { dispatch(fetchProductsListTest()) }, [dispatch])

    const loadProductListTest = async () => {
        const productosList = await listaProductosTest.getProductListTest();
        setProductList(productosList || []);
    }

    return (
    <div>
        {productList.map((product) => (
            <Card
                hoverable
                style={{ width: 240, marginTop: 16 }}
                cover={<img alt={product.name} src={product.imageUrl} />}
            >
                <Meta title={product.name} description={product.description} />
            </Card>
        ))}
    </div>
);
};

export default ProductlistTestRedux;