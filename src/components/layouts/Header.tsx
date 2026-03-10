import { Avatar, Dropdown, Menu, Space } from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth";
import toast from "react-hot-toast";
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
const navItems: NavItem[] = [
  { key: "design", label: "Design", to: "/design" },
  { key: "development", label: "Development", to: "/development" },
  { key: "components", label: "Components", to: "/components" },
  { key: "blog", label: "Blog", to: "/blog" },
  { key: "resources", label: "Resources", to: "/resources" },
  { key: "doctor", label: "Doctor", to: "/role_home" },
];

const items1: MenuProps["items"] = navItems.map((i) => ({
  key: i.key,
  label: <Link to={i.to}>{i.label}</Link>,
}));
const Header: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mautition = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      navigate("/login");
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
        <div className="flex items-center gap-4">
          <Avatar size="large" icon={<UserOutlined />} />
          <Dropdown menu={{ items: items2, onClick: handleClick }} placement="bottomRight" arrow>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ color: "black" }}>
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
