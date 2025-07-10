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
    (product) => {
      const cartProduct = formatCartItemToAdd(product, 1);
      if (product?.cartQuantity && product.cartQuantity >= product.quantity) {
        toast({
          message: `Alcanzaste el stock máximo del producto ${product?.name}.`,
        });
        return;
      }
      dispatch(addItemToCartThunk(cartProduct));
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
    (product) => {
      toast({ message: `El Producto ${product?.name} se ha eliminado.` });
      dispatch(deleteProductCartThunk(product.id));
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

  return {
    cart,
    cartDrawer,
    loading,
    error,
    totalPrice,
    loadCart,
    addToCart,
    subtractToCart,
    updateCart,
    removeFromCart,
    handleCartClick,
  };
};
