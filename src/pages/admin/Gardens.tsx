import {
  Table, Button, Space, Modal, Form, Input, Tag, Typography, Card, Tooltip, Select,
} from 'antd';
import {
  PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined,
  DeleteOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gardenApi } from '../../apis/garden';
import type { Garden } from '../../types';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

type GardenStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const STATUS_CONFIG: Record<GardenStatus, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING:  { label: 'Chờ duyệt',  icon: <ClockCircleOutlined />,  color: 'warning' },
  APPROVED: { label: 'Đã duyệt',   icon: <CheckCircleOutlined />,  color: 'success' },
  REJECTED: { label: 'Từ chối',    icon: <CloseCircleOutlined />,  color: 'error'   },
};

export default function AdminGardens() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [createModal, setCreateModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [createForm] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gardens', statusFilter],
    queryFn: () => gardenApi.getAll({ status: statusFilter }),
  });

  const approveMut = useMutation({
    mutationFn: (id: string) => gardenApi.approve(id),
    onSuccess: () => { toast.success('Đã duyệt vườn'); qc.invalidateQueries({ queryKey: ['admin-gardens'] }); },
    onError: () => toast.error('Lỗi khi duyệt'),
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => gardenApi.reject(id, reason),
    onSuccess: () => {
      toast.success('Đã từ chối vườn');
      qc.invalidateQueries({ queryKey: ['admin-gardens'] });
      setRejectModal({ open: false, id: null });
      setRejectReason('');
    },
    onError: () => toast.error('Lỗi khi từ chối'),
  });

  const createMut = useMutation({
    mutationFn: (values: any) => gardenApi.create(values),
    onSuccess: () => {
      toast.success('Tạo vườn thành công (đã duyệt)');
      qc.invalidateQueries({ queryKey: ['admin-gardens'] });
      setCreateModal(false);
      createForm.resetFields();
    },
    onError: () => toast.error('Lỗi khi tạo vườn'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => gardenApi.remove(id),
    onSuccess: () => { toast.success('Đã vô hiệu hóa vườn'); qc.invalidateQueries({ queryKey: ['admin-gardens'] }); },
    onError: () => toast.error('Lỗi'),
  });

  const gardens: Garden[] = data?.data ?? [];

  const columns = [
    {
      title: 'Tên vườn', dataIndex: 'name', key: 'name',
      render: (v: string) => <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{v}</span>,
    },
    { title: 'Nhà vườn', dataIndex: ['farmer', 'fullName'], key: 'farmer', render: (v: string) => v || '—' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (v: GardenStatus) => {
        const cfg = STATUS_CONFIG[v];
        return <Tag icon={cfg?.icon} color={cfg?.color}>{cfg?.label ?? v}</Tag>;
      },
    },
    {
      title: 'Lý do từ chối', dataIndex: 'rejectedReason', key: 'rejectedReason',
      render: (v: string) => v ? <Text type="danger" style={{ fontSize: 12 }}>{v}</Text> : '—',
    },
    {
      title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: Garden) => (
        <Space>
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Duyệt vườn">
                <Button
                  icon={<CheckOutlined />} size="small" type="primary"
                  style={{ background: 'var(--green-500)', borderColor: 'var(--green-500)' }}
                  loading={approveMut.isPending}
                  onClick={() => approveMut.mutate(record.id)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  icon={<CloseOutlined />} size="small" danger
                  onClick={() => setRejectModal({ open: true, id: record.id })}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'REJECTED' && (
            <Tooltip title="Duyệt lại">
              <Button
                icon={<CheckOutlined />} size="small"
                style={{ color: 'var(--green-600)', borderColor: 'var(--green-600)' }}
                loading={approveMut.isPending}
                onClick={() => approveMut.mutate(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="Vô hiệu hóa">
            <Button
              icon={<DeleteOutlined />} size="small" danger type="text"
              onClick={() =>
                Modal.confirm({
                  title: `Vô hiệu hóa vườn "${record.name}"?`,
                  onOk: () => deleteMut.mutate(record.id),
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>🌿 Quản lý vườn</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModal(true)}>
          Tạo vườn (Admin)
        </Button>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={setStatusFilter}
          style={{ width: 200 }}
          options={[
            { value: 'PENDING', label: '⏳ Chờ duyệt' },
            { value: 'APPROVED', label: '✅ Đã duyệt' },
            { value: 'REJECTED', label: '❌ Từ chối' },
          ]}
        />
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={gardens}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15 }}
        />
      </Card>

      {/* Reject reason modal */}
      <Modal
        title="❌ Lý do từ chối"
        open={rejectModal.open}
        onCancel={() => setRejectModal({ open: false, id: null })}
        onOk={() => rejectMut.mutate({ id: rejectModal.id!, reason: rejectReason })}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, loading: rejectMut.isPending }}
      >
        <Input.TextArea
          rows={3}
          placeholder="Nhập lý do từ chối (tuỳ chọn)..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Modal>

      {/* Create garden modal (admin) */}
      <Modal
        title="➕ Tạo vườn (Admin)"
        open={createModal}
        onCancel={() => { setCreateModal(false); createForm.resetFields(); }}
        footer={null}
        width={520}
      >
        <Form form={createForm} layout="vertical" onFinish={createMut.mutate} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Tên vườn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="farmerId" label="ID nhà vườn (Farmer)" rules={[{ required: true, message: 'Nhập ID của farmer' }]}>
            <Input placeholder="UUID của tài khoản Farmer" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="imageUrl" label="Ảnh đại diện (URL)">
            <Input />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCreateModal(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={createMut.isPending}>
                Tạo vườn
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
