import { useEffect } from "react";
import { notification } from "antd";
import { useNotification } from "../../hooks/useNotification";

const NotificationComponent = () => {
  const [api, contextHolder] = notification.useNotification();
  const { notificationState, clear } = useNotification();

  const { message, description, placement, visible } = notificationState;

  useEffect(() => {
    if (visible) {
      api.info({
        message,
        description,
        placement,
      });
      clear();
    }
  }, [visible, message, description, placement, api, clear]);

  return <>{contextHolder}</>;
};

export default NotificationComponent;
