import { Table, Card, Typography, Tag, Space, Input, Select, Avatar, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../apis/axios';
import type { VirtualPlant, PlantStatus } from '../../types';
import { PlantStatusTag } from '../../components/PlantStatusTag';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;

const RESOURCE_LABELS: Record<string, { emoji: string; color: string }> = {
  waterAmount:      { emoji: '💧', color: '#3B82F6' },
  sunlightAmount:   { emoji: '☀️', color: '#F59E0B' },
  fertilizerAmount: { emoji: '🌿', color: '#10B981' },
  airAmount:        { emoji: '🌬️', color: '#60A5FA' },
  loveAmount:       { emoji: '💚', color: '#EC4899' },
  dewAmount:        { emoji: '✨', color: '#8B5CF6' },
};

export default function AdminVirtualPlants() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlantStatus | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-virtual-plants'],
    queryFn: async () => {
      const res = await apiClient.get('/virtual-plants/all');
      return res.data as { data: VirtualPlant[] };
    },
    staleTime: 2 * 60 * 1000,
  });

  const all = data?.data ?? [];
  const filtered = all.filter((vp) => {
    const matchSearch = !search
      || vp.nickname?.toLowerCase().includes(search.toLowerCase())
      || vp.user?.email?.toLowerCase().includes(search.toLowerCase())
      || vp.user?.fullName?.toLowerCase().includes(search.toLowerCase())
      || vp.flowerType?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || vp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: 'Cây ảo', key: 'plant',
      render: (_: any, r: VirtualPlant) => (
        <Space>
          {r.flowerType?.imageUrl
            ? <Avatar src={r.flowerType.imageUrl} shape="square" size={40} style={{ borderRadius: 8 }} />
            : <Avatar shape="square" size={40} style={{ background: '#f0fdf4', fontSize: 20 }}>🌸</Avatar>
          }
          <div>
            <div style={{ fontWeight: 700, color: 'var(--green-700)' }}>
              {r.nickname ?? <Text type="secondary">Chưa đặt tên</Text>}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.flowerType?.name}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Người dùng', key: 'user',
      render: (_: any, r: VirtualPlant) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.user?.fullName ?? '—'}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.user?.email}</Text>
        </div>
      ),
    },
    {
      title: 'Giai đoạn', dataIndex: 'status', key: 'status',
      render: (v: PlantStatus) => <PlantStatusTag status={v} />,
      filters: [
        { text: 'Hạt giống', value: 'SEED' },
        { text: 'Nảy mầm', value: 'SPROUT' },
        { text: 'Đang lớn', value: 'GROWING' },
        { text: 'Ra nụ', value: 'BUDDING' },
        { text: 'Nở hoa', value: 'BLOOMING' },
      ],
      onFilter: (v: any, r: VirtualPlant) => r.status === v,
    },
    {
      title: 'Tài nguyên', key: 'resources',
      render: (_: any, r: VirtualPlant) => (
        <Space size={4} wrap>
          {Object.entries(RESOURCE_LABELS).map(([field, cfg]) => {
            const val = (r as any)[field] ?? 0;
            return (
              <Tooltip key={field} title={`${cfg.emoji} ${val}`}>
                <Tag style={{ color: cfg.color, borderColor: cfg.color + '40', background: cfg.color + '15', minWidth: 44, textAlign: 'center' }}>
                  {cfg.emoji} {val}
                </Tag>
              </Tooltip>
            );
          })}
        </Space>
      ),
    },
    {
      title: 'Streak', dataIndex: 'streakCount', key: 'streak',
      render: (v: number) => <Tag color={v >= 7 ? 'orange' : 'default'}>🔥 {v} ngày</Tag>,
      sorter: (a: VirtualPlant, b: VirtualPlant) => a.streakCount - b.streakCount,
    },
    {
      title: 'Chăm sóc lần cuối', dataIndex: 'lastCaredAt', key: 'lastCared',
      render: (v: string) => v ? (
        <Tooltip title={dayjs(v).format('HH:mm DD/MM/YYYY')}>
          <Text type={dayjs().diff(dayjs(v), 'day') > 3 ? 'danger' : 'secondary'}>
            {dayjs(v).fromNow()}
          </Text>
        </Tooltip>
      ) : <Text type="secondary">Chưa có</Text>,
      sorter: (a: VirtualPlant, b: VirtualPlant) =>
        dayjs(a.lastCaredAt ?? 0).unix() - dayjs(b.lastCaredAt ?? 0).unix(),
    },
    {
      title: 'Cây thật', key: 'realPlant',
      render: (_: any, r: VirtualPlant) => r.realPlant
        ? <Tag color="green"><code>{r.realPlant.code}</code></Tag>
        : <Tag>Chưa gắn</Tag>,
    },
    {
      title: 'Ngày bắt đầu', dataIndex: 'createdAt', key: 'ca',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
      sorter: (a: VirtualPlant, b: VirtualPlant) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  // Stats
  const stageCount = all.reduce((acc: Record<string, number>, vp) => {
    acc[vp.status] = (acc[vp.status] ?? 0) + 1; return acc;
  }, {});
  const needsAttention = all.filter(vp =>
    !vp.lastCaredAt || dayjs().diff(dayjs(vp.lastCaredAt), 'day') > 3
  ).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>🌱 Quản lý cây ảo người dùng</Title>
        <Text type="secondary">{all.length} cây đang hoạt động</Text>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Hạt giống', status: 'SEED', color: '#D4B483' },
          { label: 'Nảy mầm', status: 'SPROUT', color: '#86EFAC' },
          { label: 'Đang lớn', status: 'GROWING', color: '#34C759' },
          { label: 'Ra nụ', status: 'BUDDING', color: '#FCD34D' },
          { label: 'Nở hoa', status: 'BLOOMING', color: '#FCA5A5' },
        ].map(s => (
          <Card key={s.status} size="small" style={{ borderRadius: 10, flex: 1, minWidth: 100, borderColor: s.color + '80', cursor: 'pointer', background: s.color + '15' }}
            onClick={() => setStatusFilter(statusFilter === s.status as PlantStatus ? null : s.status as PlantStatus)}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{stageCount[s.status] ?? 0}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{s.label}</div>
            </div>
          </Card>
        ))}
        <Card size="small" style={{ borderRadius: 10, flex: 1, minWidth: 100, borderColor: '#FCA5A580', background: '#FEF2F2' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#DC2626' }}>{needsAttention}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Bỏ quên &gt;3 ngày</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tên cây, người dùng, loại hoa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 320 }}
            allowClear
          />
          <Select
            allowClear
            placeholder="Lọc theo giai đoạn"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={v => setStatusFilter(v)}
            options={[
              { value: 'SEED', label: 'Hạt giống' },
              { value: 'SPROUT', label: 'Nảy mầm' },
              { value: 'GROWING', label: 'Đang lớn' },
              { value: 'BUDDING', label: 'Ra nụ' },
              { value: 'BLOOMING', label: 'Nở hoa' },
            ]}
          />
        </Space>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15, showTotal: (t) => `Tổng ${t} cây` }}
          scroll={{ x: 1100 }}
          rowClassName={(r) =>
            r.lastCaredAt && dayjs().diff(dayjs(r.lastCaredAt), 'day') > 3 ? 'row-warning' : ''
          }
        />
      </Card>
    </div>
  );
}
