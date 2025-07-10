import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  showNotification,
  clearNotification,
} from "../store/slices/notificationSlice";

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const notificationState = useAppSelector((state) => state.notifications);

  const toast = useCallback(
    (payload) => {
      dispatch(showNotification(payload));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearNotification());
  }, [dispatch]);

  return {
    toast,
    clear,
    notificationState,
  };
};
