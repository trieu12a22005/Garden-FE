import {
  Table, Button, Space, Typography, Card, Tag, Select, Input, Tooltip, Badge,
} from 'antd';
import { EyeOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { realPlantApi } from '../../apis/realPlant';
import { gardenApi } from '../../apis/garden';
import type { RealPlant } from '../../types';
import { PlantStatusTag, PLANT_STATUS_OPTIONS } from '../../components/PlantStatusTag';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

export default function FarmerRealPlants() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [gardenFilter, setGardenFilter] = useState<string | undefined>();

  const { data: plantsData, isLoading } = useQuery({
    queryKey: ['farmer-real-plants', statusFilter, gardenFilter],
    queryFn: () => realPlantApi.getAll({
      ...(statusFilter && { status: statusFilter }),
      ...(gardenFilter && { gardenId: gardenFilter }),
    }),
  });

  const { data: gardensData } = useQuery({
    queryKey: ['farmer-gardens'],
    queryFn: () => gardenApi.getAll(),
  });

  const plants: RealPlant[] = (plantsData?.data ?? []).filter(
    (p: RealPlant) => !search || p.code.toLowerCase().includes(search.toLowerCase())
  );

  const gardenOptions = (gardensData?.data ?? []).map((g: any) => ({
    value: g.id, label: g.name,
  }));

  const columns = [
    {
      title: 'Mã cây', dataIndex: 'code', key: 'code',
      render: (v: string) => <code style={{ color: 'var(--green-700)', fontWeight: 600 }}>{v}</code>,
    },
    { title: 'Loại hoa', dataIndex: ['flowerType', 'name'], key: 'flower' },
    { title: 'Vườn', dataIndex: ['garden', 'name'], key: 'garden' },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (v: any) => <PlantStatusTag status={v} />,
    },
    {
      title: 'Đã gán', dataIndex: 'isAssigned', key: 'isAssigned',
      render: (v: boolean) => v
        ? <Badge status="success" text="Đã gán" />
        : <Badge status="default" text="Chưa gán" />,
    },
    {
      title: 'Ngày trồng', dataIndex: 'plantedAt', key: 'plantedAt',
      render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : '—',
    },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: RealPlant) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/farmer/real-plants/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Tạo cập nhật">
            <Button
              icon={<ReloadOutlined />} size="small" type="primary"
              onClick={() => navigate(`/farmer/plant-updates/create/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>🌿 Quản lý cây thật</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/farmer/real-plants/create')}>
          Thêm cây thật
        </Button>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="Tìm theo mã cây..."
            onSearch={setSearch}
            onChange={(e) => !e.target.value && setSearch('')}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo trạng thái"
            options={PLANT_STATUS_OPTIONS}
            allowClear
            onChange={setStatusFilter}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo vườn"
            options={gardenOptions}
            allowClear
            onChange={setGardenFilter}
            style={{ width: 200 }}
          />
        </Space>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={plants}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15 }}
          size="middle"
        />
      </Card>
    </div>
  );
}
