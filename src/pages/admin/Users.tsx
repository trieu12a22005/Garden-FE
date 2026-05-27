import {
  Table, Input, Select, Card, Typography, Tag, Space,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../apis/axios';
import type { User } from '../../types';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

const ROLE_COLORS = { USER: 'blue', FARMER: 'green', ADMIN: 'volcano' };
const ROLE_LABELS = { USER: 'Người dùng', FARMER: 'Nhà vườn', ADMIN: 'Admin' };

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users', { params: { role: roleFilter } });
      return res.data;
    },
  });

  const users: User[] = (data?.data ?? []).filter(
    (u: User) => !search || u.email.includes(search) || u.fullName?.includes(search)
  );

  const columns = [
    {
      title: 'Email', dataIndex: 'email', key: 'email',
      render: (v: string) => <span style={{ color: 'var(--green-700)', fontWeight: 500 }}>{v}</span>,
    },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', render: (v: string) => v || '—' },
    {
      title: 'Role', dataIndex: 'role', key: 'role',
      render: (v: keyof typeof ROLE_COLORS) => (
        <Tag color={ROLE_COLORS[v]}>{ROLE_LABELS[v]}</Tag>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive',
      render: (v: boolean) => v ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Bị khóa</Tag>,
    },
    {
      title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
  ];

  return (
    <div>
      <Title level={4} className="page-title"><UserOutlined /> Quản lý người dùng</Title>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="Tìm theo email hoặc tên..."
            onSearch={setSearch}
            onChange={(e) => !e.target.value && setSearch('')}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo role"
            allowClear
            onChange={setRoleFilter}
            style={{ width: 180 }}
            options={[
              { value: 'USER', label: 'Người dùng' },
              { value: 'FARMER', label: 'Nhà vườn' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
        </Space>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15 }}
        />
      </Card>
    </div>
  );
}
