import { Avatar, Dropdown, Menu, Space } from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation } from "react-router-dom";
import { DownOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
type NavItem = {
  key: string;
  label: string;
  to: string;
};
const items2: MenuProps['items'] = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
  {
    key: '3',
    label: 'Billing',
    extra: '⌘B',
  },
  {
    key: '4',
    label: 'Settings',
    icon: <SettingOutlined />,
    extra: '⌘S',
  },
];
const navItems: NavItem[] = [
  { key: "design", label: "Design", to: "/design" },
  { key: "development", label: "Development", to: "/development" },
  { key: "components", label: "Components", to: "/components" },
  { key: "blog", label: "Blog", to: "/blog" },
  { key: "resources", label: "Resources", to: "/resources" },
];

const items1: MenuProps["items"] = navItems.map((i) => ({
  key: i.key,
  label: <Link to={i.to}>{i.label}</Link>,
}));

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const selectedKey =
    navItems.find((i) => pathname === i.to || pathname.startsWith(i.to + "/"))
      ?.key ?? "";

  return (
    <header className="text-white font-bold shadow-md">
      <div className="mx-auto max-w-6xl px-4  flex justify-between items-center h-16">
        <Menu
          mode="horizontal"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={items1}
          style={{
            background: "transparent",
            color: "white",
            borderBottom: "none",
            marginLeft: "300px"
          }}
        />
        <div className="flex items-center gap-4">
          <Avatar size="large" icon={<UserOutlined />} />
        <Dropdown menu={{ items: items2 }} placement="bottomRight" arrow>
    <a onClick={(e) => e.preventDefault()}>
      <Space style={{color:"black"}}>
        Long Triều
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
