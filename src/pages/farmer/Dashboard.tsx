import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, Space } from 'antd';
import {
  EnvironmentOutlined, AppstoreOutlined, CheckCircleOutlined,
  ClockCircleOutlined, WarningOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { gardenApi } from '../../apis/garden';
import { realPlantApi } from '../../apis/realPlant';
import type { RealPlant } from '../../types';
import { PlantStatusTag } from '../../components/PlantStatusTag';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function FarmerDashboard() {
  const navigate = useNavigate();

  const { data: gardensData } = useQuery({
    queryKey: ['farmer-gardens'],
    queryFn: () => gardenApi.getAll(),
  });

  const { data: plantsData } = useQuery({
    queryKey: ['farmer-real-plants'],
    queryFn: () => realPlantApi.getAll(),
  });

  const gardens = gardensData?.data ?? [];
  const plants: RealPlant[] = plantsData?.data ?? [];

  const assigned = plants.filter((p) => p.isAssigned).length;
  const unassigned = plants.filter((p) => !p.isAssigned).length;
  const needsCare = plants.filter((p) => p.status === 'NEEDS_CARE').length;

  const statCards = [
    { title: 'Tổng số vườn', value: gardens.length, icon: <EnvironmentOutlined />, color: '#2ea82e' },
    { title: 'Tổng số cây thật', value: plants.length, icon: <AppstoreOutlined />, color: '#1565c0' },
    { title: 'Đã gán cho user', value: assigned, icon: <CheckCircleOutlined />, color: '#6a1b9a' },
    { title: 'Chưa gán', value: unassigned, icon: <ClockCircleOutlined />, color: '#e65100' },
    { title: 'Cần chăm sóc', value: needsCare, icon: <WarningOutlined />, color: '#b71c1c' },
  ];

  const needsUpdate = plants.filter((p) => p.status !== 'COMPLETED');

  const columns = [
    { title: 'Mã cây', dataIndex: 'code', key: 'code', render: (v: string) => <code>{v}</code> },
    { title: 'Loại hoa', dataIndex: ['flowerType', 'name'], key: 'flower' },
    { title: 'Vườn', dataIndex: ['garden', 'name'], key: 'garden' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (v: any) => <PlantStatusTag status={v} /> },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: RealPlant) => (
        <Button
          type="primary" size="small"
          icon={<ReloadOutlined />}
          onClick={() => navigate(`/farmer/plant-updates?plantId=${record.id}`)}
        >
          Cập nhật
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} className="page-title">🌿 Tổng quan nhà vườn</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={s.title}>
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

      <Card
        title={
          <Space>
            <WarningOutlined style={{ color: '#e65100' }} />
            <span>Cây cần cập nhật</span>
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          dataSource={needsUpdate.slice(0, 10)}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
