import { Table, Card, Typography, Select, Space, Image, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { gardenApi } from '../../apis/garden';
import { apiClient } from '../../apis/axios';
import { PlantStatusTag } from '../../components/PlantStatusTag';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Title } = Typography;

export default function AdminPlantUpdates() {
  const [gardenFilter, setGardenFilter] = useState<string | undefined>();

  const { data: updatesData, isLoading } = useQuery({
    queryKey: ['admin-plant-updates', gardenFilter],
    queryFn: async () => {
      const res = await apiClient.get('/plant-updates/all', { params: { gardenId: gardenFilter } });
      return res.data;
    },
  });

  const { data: gardensData } = useQuery({
    queryKey: ['all-gardens'],
    queryFn: () => gardenApi.getAll(),
  });

  const gardenOptions = (gardensData?.data ?? []).map((g: any) => ({ value: g.id, label: g.name }));

  const columns = [
    {
      title: 'Ảnh', dataIndex: 'imageUrl', key: 'imageUrl',
      render: (v: string) => <Image src={v} width={60} height={50} style={{ objectFit: 'cover', borderRadius: 6 }} />,
    },
    { title: 'Mã cây', dataIndex: ['realPlant', 'code'], key: 'code', render: (v: string) => <code>{v}</code> },
    { title: 'Nhà vườn', dataIndex: ['farmer', 'fullName'], key: 'farmer' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (v: any) => <PlantStatusTag status={v} /> },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    { title: 'Ngày cập nhật', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => dayjs(v).format('HH:mm DD/MM/YYYY') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>📸 Cập nhật cây</Title>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo vườn"
          options={gardenOptions}
          allowClear
          onChange={setGardenFilter}
          style={{ width: 220 }}
        />
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={updatesData?.data ?? []} columns={columns} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} />
      </Card>
    </div>
  );
}
