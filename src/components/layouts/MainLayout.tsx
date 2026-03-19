import React, { useState } from "react";
import { Layout, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import CustomHeader from "./Header";
import MenuApp from "./menu/Menu";
const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      {/* Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        theme="light" // Bắt buộc là light
        style={{ 
          background: "#ffffff", // Ép toàn bộ cột bên trái thành trắng
          minHeight: "100vh"     // Bắt buộc phải có cái này để che màu xám ở đáy
        }}
      >
        {/* Nút Toggle */}
        <div
          className={`flex items-center h-16 ${
            collapsed ? "justify-center" : "justify-start px-4"
          }`}
        >
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>

        {/* Menu */}
        <MenuApp collapsed={collapsed} />
      </Sider>

      {/* Vùng bên phải (Header + Content) */}
      <Layout>
        {/* Header */}
        <Header
          style={{ background: colorBgContainer, padding: 0 }}
          className="border-b border-gray-200" // Có thể xóa class này nếu bạn không muốn cả đường viền dưới của Header
        >
          <div className="flex items-center  h-full">
            <div className="flex-1">
              <CustomHeader />
            </div>
          </div>
        </Header>

        {/* Nội dung chính - ĐÃ XÓA m-6, p-6, rounded-lg để sát lề hoàn toàn */}
        <Content className="bg-white min-h-[280px]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
    
  );
};

export default MainLayout;