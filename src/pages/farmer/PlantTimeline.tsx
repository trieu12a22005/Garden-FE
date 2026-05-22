import { Timeline, Card, Image, Typography, Spin, Tag, Empty } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { realPlantApi } from '../../apis/realPlant';
import { plantUpdateApi } from '../../apis/plantUpdate';
import { PlantStatusTag } from '../../components/PlantStatusTag';
import dayjs from 'dayjs';
import { Button } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PlantTimeline() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: plantData, isLoading: loadingPlant } = useQuery({
    queryKey: ['real-plant', id],
    queryFn: () => realPlantApi.getOne(id!),
  });

  const { data: updatesData, isLoading: loadingUpdates } = useQuery({
    queryKey: ['plant-updates', id],
    queryFn: () => plantUpdateApi.getByRealPlant(id!),
  });

  const plant = plantData?.data;
  const updates = updatesData?.data ?? [];

  if (loadingPlant || loadingUpdates) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 8 }} />
          <Title level={4} className="page-title" style={{ margin: 0 }}>
            📜 Lịch sử cây: <code>{plant?.code}</code>
          </Title>
          {plant && <Text type="secondary">{plant.flowerType?.name} — {plant.garden?.name}</Text>}
        </div>
        <Button
          type="primary" icon={<PlusOutlined />}
          onClick={() => navigate(`/farmer/plant-updates/create/${id}`)}
        >
          Thêm cập nhật
        </Button>
      </div>

      {updates.length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="Chưa có cập nhật nào cho cây này" />
        </Card>
      ) : (
        <Card style={{ borderRadius: 12 }}>
          <Timeline
            items={updates.map((u: any) => ({
              color: 'green',
              children: (
                <Card
                  size="small"
                  style={{ borderRadius: 10, marginBottom: 8, border: '1px solid #e8f5e9' }}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    {u.imageUrl && (
                      <Image
                        src={u.imageUrl}
                        width={100}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <PlantStatusTag status={u.status} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(u.createdAt).format('HH:mm DD/MM/YYYY')}
                        </Text>
                      </div>
                      {u.note && <Text>{u.note}</Text>}
                      {u.healthNote && (
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>🩺 {u.healthNote}</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ),
            }))}
          />
        </Card>
      )}
    </div>
  );
}
