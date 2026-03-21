import { Avatar, Button, Dropdown, Menu, Space } from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation} from "react-router-dom";
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth";
import toast from "react-hot-toast";
import { UseAuth } from "@/AuthContext";
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
    label: 'Logout',
    icon: <LogoutOutlined />,
    extra: '⌘S',
  },
];
const Header: React.FC = () => {
  const { user } = UseAuth();
  const navItems: NavItem[] = [
  { key: "design", label: "Design", to: "/design" },
  { key: "development", label: "Development", to: "/development" },
  { key: "components", label: "Components", to: "/components" },
  { key: "blog", label: "Blog", to: "/blog" },
  { key: "resources", label: "Resources", to: "/resources" },
  { key: user?.role ||" ", label: user?.role||" ", to: "/role_home" },
];

const items1: MenuProps["items"] = navItems.map((i) => ({
  key: i.key,
  label: <Link to={i.to}>{i.label}</Link>,
}));
  const currentName = user ? `${user.firstName} ${user.lastName}` : ""; 
  const { pathname } = useLocation();
  const mautition = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      localStorage.removeItem("user");
      window.location.href = '/login';
    },
    onError: (error) => {
      toast.error(error?.message || "Đăng xuất thất bại");
    },
  });
  const selectedKey =
    navItems.find((i) => pathname === i.to || pathname.startsWith(i.to + "/"))
      ?.key ?? "";
  const handleClick: MenuProps["onClick"] = (e) => {
    if (e.key === "3") {

      mautition.mutate();
    }
  };
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
        {currentName !== "" ? (
        <div className="flex items-center gap-4">
          <Avatar size="large" icon={<UserOutlined />} />
          <Dropdown menu={{ items: items2, onClick: handleClick }} placement="bottomRight" arrow>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ color: "black" }}>
                {currentName}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        ) : (
        <Link to="/login">
          <Button type="primary">Login</Button>
        </Link>
        )}

      </div>
    </header>
  );
};

export default Header;