import {
  Table, Card, Typography, Select, Image, Space, Tag, Empty, Input,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../apis/axios';
import { gardenApi } from '../../apis/garden';
import { PlantStatusTag } from '../../components/PlantStatusTag';
import type { PlantUpdate } from '../../types';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Search } = Input;

export default function FarmerPlantUpdates() {
  const [gardenFilter, setGardenFilter] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  const { data: updatesData, isLoading } = useQuery({
    queryKey: ['farmer-plant-updates', gardenFilter],
    queryFn: async () => {
      const res = await apiClient.get('/plant-updates/all', {
        params: { gardenId: gardenFilter },
      });
      return res.data;
    },
  });

  const { data: gardensData } = useQuery({
    queryKey: ['farmer-gardens'],
    queryFn: () => gardenApi.getAll(),
  });

  const gardenOptions = (gardensData?.data ?? []).map((g: any) => ({
    value: g.id,
    label: g.name,
  }));

  const updates: PlantUpdate[] = (updatesData?.data ?? []).filter((u: PlantUpdate) => {
    if (!search) return true;
    const code = u.realPlant?.code?.toLowerCase() ?? '';
    return code.includes(search.toLowerCase());
  });

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (v: string) =>
        v ? (
          <Image
            src={v}
            width={64}
            height={56}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        ) : (
          <div
            style={{
              width: 64, height: 56, borderRadius: 8,
              background: '#f0fdf4', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}
          >
            🌿
          </div>
        ),
    },
    {
      title: 'Mã cây',
      dataIndex: ['realPlant', 'code'],
      key: 'code',
      render: (v: string) => (
        <code style={{ color: 'var(--green-700)', fontWeight: 700, fontSize: 13 }}>{v}</code>
      ),
    },
    {
      title: 'Loại hoa',
      key: 'flowerType',
      render: (_: any, r: PlantUpdate) => (
        <Text style={{ fontWeight: 600 }}>{r.realPlant?.flowerType?.name ?? '—'}</Text>
      ),
    },
    {
      title: 'Trạng thái ghi nhận',
      dataIndex: 'status',
      key: 'status',
      render: (v: any) => <PlantStatusTag status={v} />,
    },
    {
      title: 'Người cập nhật',
      key: 'farmer',
      render: (_: any, r: PlantUpdate) => (
        <Space size={4}>
          <span>👤</span>
          <Text>{r.farmer?.fullName ?? '—'}</Text>
        </Space>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (v: string) => v ? <Text type="secondary">{v}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Ghi chú sức khoẻ',
      dataIndex: 'healthNote',
      key: 'healthNote',
      ellipsis: true,
      render: (v: string) => v ? <Tag color="green">{v}</Tag> : '—',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{dayjs(v).format('HH:mm')}</div>
          <div style={{ fontSize: 11, color: '#888' }}>{dayjs(v).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>
          📸 Lịch sử cập nhật cây
        </Title>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <FilterOutlined style={{ color: 'var(--green-600)' }} />
          <Search
            placeholder="Tìm theo mã cây..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
          <Select
            placeholder="Lọc theo vườn"
            options={gardenOptions}
            allowClear
            onChange={setGardenFilter}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: 220 }}
          />
        </Space>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={updates}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15, showTotal: (total) => `Tổng ${total} lần cập nhật` }}
          scroll={{ x: 900 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có lần cập nhật nào. Hãy vào trang Cây thật để cập nhật tình trạng cây."
              />
            ),
          }}
        />
      </Card>
    </div>
  );
}
