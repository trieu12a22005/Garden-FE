import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd';
import {
  DashboardOutlined, TeamOutlined, EnvironmentOutlined,
  AppstoreOutlined, PictureOutlined, UserOutlined,
  LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  BellOutlined, SettingOutlined, HeartOutlined, ExperimentOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import authApi from '../apis/auth';
import toast from 'react-hot-toast';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const adminMenuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  {
    key: 'users-group', icon: <TeamOutlined />, label: 'Người dùng',
    children: [
      { key: '/admin/users', label: 'Tất cả người dùng' },
      { key: '/admin/farmers', label: 'Nhà vườn' },
    ],
  },
  {
    key: 'plant-group', icon: <EnvironmentOutlined />, label: 'Cây & Vườn',
    children: [
      { key: '/admin/gardens', label: '🏡 Vườn' },
      { key: '/admin/real-plants', label: '🌿 Cây thật' },
      { key: '/admin/virtual-plants', label: '🌱 Cây ảo người dùng' },
      { key: '/admin/plant-updates', label: '📸 Cập nhật từ vườn' },
    ],
  },
  {
    key: 'content-group', icon: <AppstoreOutlined />, label: 'Nội dung',
    children: [
      { key: '/admin/flower-types', label: '🌸 Loại hoa' },
      { key: '/admin/care-tasks', label: '✅ Nhiệm vụ chăm sóc' },
    ],
  },
];


export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
      toast.success('Đã đăng xuất');
    }
  };

  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') handleLogout();
    },
  };

  const openKeys = adminMenuItems
    .filter((item) => 'children' in item && item.children?.some((c) => c.key === location.pathname))
    .map((item) => item.key);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{ background: 'var(--sidebar-bg)' }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontSize: collapsed ? 20 : 16, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            {collapsed ? '🌿' : '🌿 Garden Admin'}
          </span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys as string[]}
          items={adminMenuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'var(--sidebar-bg)', borderRight: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          height: 64,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, color: 'var(--green-600)' }}
          />
          <Space>
            <Button type="text" icon={<BellOutlined />} style={{ color: 'var(--green-600)' }} />
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={user?.avatarUrl}
                  icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
                  style={{ background: 'var(--green-600)' }}
                />
                <Text strong style={{ color: 'var(--green-700)' }}>
                  {user?.fullName ?? user?.email}
                </Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px', background: 'var(--content-bg)', minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
