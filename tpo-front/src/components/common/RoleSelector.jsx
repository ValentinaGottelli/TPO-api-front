import React, { useState } from "react";
import { Card, Select, Button, Space, Typography, message, Avatar } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  CrownOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useAuthRedux } from "../../hooks/useAuth";

const { Title, Text } = Typography;
const { Option } = Select;

const RoleSelector = () => {
  const { user, updateUser } = useAuthRedux();
  const [selectedRole, setSelectedRole] = useState(user?.role || "COMPRADOR");
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    {
      value: "COMPRADOR",
      label: "Comprador",
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
      description: "Puedes comprar y ver productos",
    },
    {
      value: "VENDEDOR",
      label: "Vendedor",
      icon: <ShopOutlined />,
      color: "#1890ff",
      description: "Puedes crear y gestionar productos",
    },
  ];

  const getCurrentRoleInfo = () => {
    return (
      roleOptions.find((role) => role.value === user?.role) || roleOptions[0]
    );
  };

  const getSelectedRoleInfo = () => {
    return (
      roleOptions.find((role) => role.value === selectedRole) || roleOptions[0]
    );
  };

  const handleRoleChange = async () => {
    if (selectedRole === user?.role) {
      message.info("Ya tienes ese rol asignado");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        role: selectedRole,
      };

      const success = updateUser(updatedUser);

      if (success) {
        message.success(
          `Rol cambiado a ${getSelectedRoleInfo().label} exitosamente`
        );

        // Recargar la página para aplicar los cambios de ruta
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error("Error al cambiar el rol");
      }
    } catch (error) {
      message.error("Error al cambiar el rol: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentRole = getCurrentRoleInfo();

  return (
    <Card
      title={
        <Space>
          <SwapOutlined />
          <span>Cambiar Tipo de Cuenta</span>
        </Space>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Rol actual */}
        <div>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Rol Actual:
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              border: `2px solid ${currentRole.color}`,
            }}
          >
            <Avatar
              style={{ backgroundColor: currentRole.color, marginRight: 12 }}
              icon={currentRole.icon}
            />
            <div>
              <Text strong style={{ color: currentRole.color }}>
                {currentRole.label}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {currentRole.description}
              </Text>
            </div>
          </div>
        </div>

        {/* Selector de nuevo rol */}
        <div>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Cambiar a:
          </Text>
          <Select
            style={{ width: "100%" }}
            size="large"
            value={selectedRole}
            onChange={setSelectedRole}
          >
            {roleOptions.map((role) => (
              <Option key={role.value} value={role.value}>
                <Space>
                  <Avatar
                    size="small"
                    style={{ backgroundColor: role.color }}
                    icon={role.icon}
                  />
                  <div>
                    <div>{role.label}</div>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {role.description}
                    </Text>
                  </div>
                </Space>
              </Option>
            ))}
          </Select>
        </div>

        {/* Botón de cambio */}
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          disabled={selectedRole === user?.role}
          onClick={handleRoleChange}
          icon={<SwapOutlined />}
        >
          {selectedRole === user?.role
            ? "Rol ya asignado"
            : `Cambiar a ${getSelectedRoleInfo().label}`}
        </Button>

        {/* Nota informativa */}
        <div
          style={{
            padding: "12px",
            backgroundColor: "#e6f7ff",
            borderRadius: "6px",
            border: "1px solid #91d5ff",
          }}
        >
          <Text type="secondary" style={{ fontSize: "12px" }}>
            💡 <strong>Nota:</strong> Al cambiar tu rol, serás redirigido
            automáticamente a la vista correspondiente. Los vendedores pueden
            gestionar productos, mientras que los compradores pueden explorar y
            comprar.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default RoleSelector;
