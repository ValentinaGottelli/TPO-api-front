import { useEffect, useState } from "react"
import listaProductosTest from "../../services/pruebaProductos/listaProductosTest";
import { Card } from 'antd';
import { Image } from 'antd';
const { Meta } = Card;

export const ProductlistTest = () => {
    const [productList, setProductList] = useState([]);


    useEffect(() => { loadProductListTest() }, [productList])

    const loadProductListTest = async () => {
        const productosList = await listaProductosTest.getProductListTest();
        setProductList(productosList || []);
    }

    return (
        
        productList.map((product) =>
            
                <Card
                    hoverable
                    style={{ width: 240 , marginTop: 16}}
                    cover={<img alt={product.name} src={product.imageUrl} />}
                >
                    <Meta title={product.name} description={product.description} />
                </Card>
            )
    );
};

export default ProductlistTest;