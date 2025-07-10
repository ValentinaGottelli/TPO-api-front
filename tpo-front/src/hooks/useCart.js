import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  getCartThunk,
  addItemToCartThunk,
  updateProductCartThunk,
  deleteProductCartThunk,
  handleCartClickAction,
  selectCart,
  selectCartDrawer,
  selectCartLoading,
  selectCartError,
  selectCartTotalPrice,
} from "../store/slices/cartSlice";
import { useNotification } from "./useNotification";
import { message } from "antd";

export const useCart = () => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCart);
  const cartDrawer = useAppSelector(selectCartDrawer);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const { toast } = useNotification();

  const loadCart = useCallback(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  const addToCart = useCallback(
    async (product) => {
      const cartProduct = formatCartItemToAdd(product, 1);
      if (product?.cartQuantity && product.cartQuantity >= product.quantity) {
        toast({
          message: `Alcanzaste el stock máximo del producto ${product?.name}.`,
        });
        return;
      }
      try {
        await dispatch(addItemToCartThunk(cartProduct)).unwrap()
        toast({
          message: `Agregaste el producto al carrito correctamente.`,
        });
      } catch { 
        toast({
          message: `No se pudo agregar el producto al carrito.`,
        });
      }
    },
    [dispatch]
  );

  const subtractToCart = useCallback(
    (product) => {
      if (product.cartQuantity <= 1) {
        return;
      }
      const cartProduct = formatCartItemToAdd(
        product,
        product.cartQuantity - 1
      );
      dispatch(updateProductCartThunk(cartProduct));
    },
    [dispatch]
  );

  const updateCart = useCallback(
    (product, value) => {
      if (product.cartQuantity <= 0) {
        return;
      } else if (product.cartQuantity > product.quantity) {
        toast({
          message: `Alcanzaste el stock máximo del producto ${product?.name}.`,
        });
        return;
      }

      const cartProduct = formatCartItemToAdd(product, value);

      dispatch(updateProductCartThunk(cartProduct));
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    async (product) => {
      try {
        await dispatch(deleteProductCartThunk(product.id)).unwrap();
        toast({ message: `El Producto ${product?.name} se ha eliminado.` });
      } catch { 
        toast({ message: `El Producto ${product?.name} no pudo ser eliminado.` });
      }
    },
    [dispatch]
  );

  const handleCartClick = useCallback(() => {
    dispatch(handleCartClickAction());
  }, [dispatch]);

  const formatCartItemToAdd = (product, updateQuantity) => {
    return {
      productId: product.id,
      quantity: updateQuantity ?? product.cartQuantity,
    };
  };

  const getTotalPriceCart = useCallback(() => {
    return totalPrice;
  }, [totalPrice]);

  return {
    cart,
    cartDrawer,
    loading,
    error,
    totalPrice,
    getTotalPriceCart,
    loadCart,
    addToCart,
    subtractToCart,
    updateCart,
    removeFromCart,
    handleCartClick,
  };
};
