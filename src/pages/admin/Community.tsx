import {
  Table, Button, Space, Modal, Image, Tag, Typography, Card,
  Input, Select, Avatar, Tooltip, Popconfirm, Badge,
} from 'antd';
import {
  DeleteOutlined, EyeOutlined, SearchOutlined,
  FilterOutlined, PictureOutlined, StopOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi, type CommunityPost } from '../../apis/community';
import toast from 'react-hot-toast';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  VISIBLE:  { label: 'Hiển thị', color: 'green' },
  REPORTED: { label: 'Bị báo cáo', color: 'orange' },
  HIDDEN:   { label: 'Đã ẩn', color: 'red' },
};

export default function AdminCommunity() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [previewItem, setPreviewItem] = useState<CommunityPost | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['community-posts-admin', statusFilter],
    queryFn: () => communityApi.getAllAdmin({ status: statusFilter }),
    staleTime: 30_000,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => communityApi.deletePost(id),
    onSuccess: () => {
      toast.success('Đã xóa bài đăng');
      qc.invalidateQueries({ queryKey: ['community-posts-admin'] });
    },
    onError: () => toast.error('Lỗi khi xóa'),
  });

  const hideMut = useMutation({
    mutationFn: (id: string) => communityApi.hidePost(id),
    onSuccess: () => {
      toast.success('Đã ẩn bài đăng');
      qc.invalidateQueries({ queryKey: ['community-posts-admin'] });
    },
    onError: () => toast.error('Lỗi khi ẩn'),
  });

  const allPosts: CommunityPost[] = data?.data ?? [];

  // Filter client-side by text
  const filtered = allPosts.filter((u) => {
    const matchSearch = !search || [
      u.user?.fullName ?? '',
      u.user?.email ?? '',
      u.content ?? '',
      u.taskTitle ?? '',
    ].some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const columns = [
    {
      title: 'Ảnh', dataIndex: 'imageUrl', key: 'img', width: 80,
      render: (url: string | null) => url ? (
        <Image
          src={url}
          width={64} height={64}
          style={{ objectFit: 'cover', borderRadius: 10, cursor: 'pointer' }}
          preview={{ mask: <EyeOutlined /> }}
        />
      ) : (
        <div style={{ width: 64, height: 64, background: '#f0f9f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PictureOutlined style={{ fontSize: 20, color: '#aaa' }} />
        </div>
      ),
    },
    {
      title: 'Người dùng', key: 'user',
      render: (_: any, r: CommunityPost) => (
        <Space>
          <Avatar src={r.user?.avatarUrl} style={{ background: 'var(--green-600)', fontSize: 12 }}>
            {(r.user?.fullName ?? 'U')[0].toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 13 }}>{r.user?.fullName ?? '—'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.user?.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Nhiệm vụ', key: 'task',
      render: (_: any, r: CommunityPost) => (
        <Text style={{ fontSize: 13 }}>{r.taskTitle ?? '—'}</Text>
      ),
    },
    {
      title: 'Nội dung', key: 'content',
      render: (_: any, r: CommunityPost) => (
        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 13, maxWidth: 200 }}>
          {r.content ?? <Text type="secondary">—</Text>}
        </Paragraph>
      ),
    },
    {
      title: 'Trạng thái', key: 'status',
      render: (_: any, r: CommunityPost) => {
        const info = STATUS_LABELS[r.status] ?? { label: r.status, color: 'default' };
        return (
          <Space direction="vertical" size={2}>
            <Tag color={info.color}>{info.label}</Tag>
            {r.reportCount > 0 && (
              <Text type="danger" style={{ fontSize: 12 }}>{r.reportCount} report(s)</Text>
            )}
            <Tag color={r.visibility === 'PUBLIC' ? 'blue' : 'default'}>{r.visibility}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Thời gian', dataIndex: 'createdAt', key: 'date', width: 130,
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(v).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          <br />
          {new Date(v).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      ),
    },
    {
      title: 'Hành động', key: 'act', width: 120,
      render: (_: any, r: CommunityPost) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" onClick={() => setPreviewItem(r)} />
          </Tooltip>
          {r.status !== 'HIDDEN' && (
            <Popconfirm
              title="Ẩn bài viết này khỏi cộng đồng?"
              onConfirm={() => hideMut.mutate(r.id)}
              okText="Ẩn" cancelText="Hủy"
            >
              <Tooltip title="Ẩn bài viết">
                <Button icon={<StopOutlined />} size="small" warning />
              </Tooltip>
            </Popconfirm>
          )}
          <Popconfirm
            title="Xóa vĩnh viễn bài đăng này?"
            description="Hành động này không thể khôi phục."
            okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
            onConfirm={() => deleteMut.mutate(r.id)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>🌿 Quản lý Cộng đồng</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Quản lý bài chia sẻ của người dùng — tổng {data?.pagination?.total ?? 0} bài</Text>
        </div>
        <Badge count={filtered.length} showZero color="green" offset={[-4, 4]}>
          <Tag color="green" style={{ fontSize: 13 }}>Đang hiển thị</Tag>
        </Badge>
      </div>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="Tìm theo tên user, email, nội dung..."
            allowClear
            style={{ width: 320 }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            suffixIcon={<FilterOutlined />}
            onChange={(v) => setStatusFilter(v)}
            options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </Space>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 12, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        open={!!previewItem}
        onCancel={() => setPreviewItem(null)}
        footer={null}
        width={560}
        title={
          <Space>
            <Avatar src={previewItem?.user?.avatarUrl} style={{ background: 'var(--green-600)' }}>
              {(previewItem?.user?.fullName ?? 'U')[0].toUpperCase()}
            </Avatar>
            <div>
              <div style={{ fontWeight: 700 }}>{previewItem?.user?.fullName ?? '—'} ({previewItem?.user?.email})</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {previewItem ? new Date(previewItem.createdAt).toLocaleString('vi-VN') : ''}
              </Text>
            </div>
          </Space>
        }
      >
        {previewItem && (
          <div>
            {previewItem.imageUrl && (
              <Image
                src={previewItem.imageUrl}
                width="100%"
                style={{ borderRadius: 12, maxHeight: 340, objectFit: 'cover' }}
              />
            )}
            <div style={{ marginTop: 16 }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space>
                  <Text strong>Trạng thái:</Text>
                  {(() => {
                    const info = STATUS_LABELS[previewItem.status] ?? { label: previewItem.status, color: 'default' };
                    return <Tag color={info.color}>{info.label}</Tag>;
                  })()}
                  {previewItem.reportCount > 0 && (
                    <Text type="danger" strong>({previewItem.reportCount} reports)</Text>
                  )}
                </Space>
                
                {previewItem.taskTitle && (
                  <div>
                    <Text strong>Nhiệm vụ:</Text> <Text>{previewItem.taskTitle}</Text>
                  </div>
                )}
                
                {previewItem.content && (
                  <div>
                    <Text strong>📝 Nội dung chia sẻ:</Text>
                    <Paragraph style={{ marginTop: 4, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
                      {previewItem.content}
                    </Paragraph>
                  </div>
                )}
              </Space>
            </div>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                {previewItem.status !== 'HIDDEN' && (
                  <Popconfirm
                    title="Ẩn bài viết này khỏi cộng đồng?"
                    okText="Ẩn" cancelText="Hủy"
                    onConfirm={() => { hideMut.mutate(previewItem.id); setPreviewItem(null); }}
                  >
                    <Button warning icon={<StopOutlined />}>Ẩn bài viết</Button>
                  </Popconfirm>
                )}
                <Popconfirm
                  title="Xóa vĩnh viễn bài đăng này?"
                  okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
                  onConfirm={() => { deleteMut.mutate(previewItem.id); setPreviewItem(null); }}
                >
                  <Button danger icon={<DeleteOutlined />}>Xóa bài đăng</Button>
                </Popconfirm>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
