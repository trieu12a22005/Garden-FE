import { Row, Col, Card, Statistic, Table, Typography, Select, Space } from 'antd';
import {
  TeamOutlined, EnvironmentOutlined,
  AppstoreOutlined, HeartOutlined, PictureOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gardenApi } from '../../apis/garden';
import { realPlantApi } from '../../apis/realPlant';
import { flowerTypeApi } from '../../apis/flowerType';
import { PlantStatusTag } from '../../components/PlantStatusTag';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function AdminDashboard() {
  const { data: gardensData } = useQuery({ queryKey: ['all-gardens'], queryFn: () => gardenApi.getAll() });
  const { data: plantsData } = useQuery({ queryKey: ['all-real-plants'], queryFn: () => realPlantApi.getAll() });
  const { data: flowersData } = useQuery({ queryKey: ['flower-types'], queryFn: () => flowerTypeApi.getAll() });

  const [gardenFilter, setGardenFilter] = useState<string | null>(null);
  const [flowerFilter, setFlowerFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const gardens = gardensData?.data ?? [];
  const allPlants = plantsData?.data ?? [];
  const flowers = flowersData?.data ?? [];

  const plants = allPlants.filter((p: any) => {
    if (gardenFilter && p.gardenId !== gardenFilter) return false;
    if (flowerFilter && p.flowerTypeId !== flowerFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const statCards = [
    { title: 'Tổng số vườn', value: gardens.length, icon: <EnvironmentOutlined />, color: '#2ea82e' },
    { title: 'Tổng cây thật', value: plants.length, icon: <AppstoreOutlined />, color: '#1565c0' },
    { title: 'Đã gán', value: plants.filter((p: any) => p.isAssigned).length, icon: <HeartOutlined />, color: '#6a1b9a' },
    { title: 'Loại hoa', value: flowers.length, icon: <PictureOutlined />, color: '#e65100' },
    { title: 'Cần chăm sóc', value: plants.filter((p: any) => p.status === 'NEEDS_CARE').length, icon: <TeamOutlined />, color: '#b71c1c' },
  ];

  const recentPlants = plants.slice(0, 8);
  const columns = [
    { title: 'Mã cây', dataIndex: 'code', key: 'code', render: (v: string) => <code>{v}</code> },
    { title: 'Loại hoa', dataIndex: ['flowerType', 'name'], key: 'flower' },
    { title: 'Vườn', dataIndex: ['garden', 'name'], key: 'garden' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (v: any) => <PlantStatusTag status={v} /> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => dayjs(v).format('DD/MM/YYYY') },
  ];

  return (
    <div>
      <Title level={4} className="page-title">🌿 Tổng quan hệ thống</Title>

      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Space wrap>
          <Select
            allowClear
            placeholder="Tất cả các vườn"
            style={{ width: 220 }}
            options={gardens.map((g: any) => ({ value: g.id, label: g.name }))}
            onChange={setGardenFilter}
            value={gardenFilter}
          />
          <Select
            allowClear
            placeholder="Tất cả loại hoa"
            style={{ width: 200 }}
            options={flowers.map((f: any) => ({ value: f.id, label: f.name }))}
            onChange={setFlowerFilter}
            value={flowerFilter}
          />
          <Select
            allowClear
            placeholder="Tất cả trạng thái"
            style={{ width: 180 }}
            options={[
              { value: 'SEED', label: 'Hạt giống' },
              { value: 'SPROUT', label: 'Nảy mầm' },
              { value: 'GROWING', label: 'Đang lớn' },
              { value: 'BUDDING', label: 'Ra nụ' },
              { value: 'BLOOMING', label: 'Nở hoa' },
              { value: 'NEEDS_CARE', label: 'Cần chăm sóc' },
              { value: 'COMPLETED', label: 'Hoàn thành' },
            ]}
            onChange={setStatusFilter}
            value={statusFilter}
          />
        </Space>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={s.title}>
            <Card className="stat-card">
              <Statistic
                title={s.title}
                value={s.value}
                prefix={<span style={{ color: s.color }}>{s.icon}</span>}
                valueStyle={{ color: s.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="🌱 Cây thật mới nhất" style={{ borderRadius: 12 }}>
        <Table
          dataSource={recentPlants}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
