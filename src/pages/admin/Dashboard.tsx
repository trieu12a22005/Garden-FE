import { Row, Col, Card, Statistic, Table, Typography, Space } from 'antd';
import {
  UserOutlined, TeamOutlined, EnvironmentOutlined,
  AppstoreOutlined, HeartOutlined, PictureOutlined,
} from '@ant-design/icons';
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

  const gardens = gardensData?.data ?? [];
  const plants = plantsData?.data ?? [];
  const flowers = flowersData?.data ?? [];

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
