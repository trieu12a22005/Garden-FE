import {
  Table, Button, Space, Modal, Form, Input, Select, Switch, Typography, Card, Tooltip, Tag,
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../apis/axios';
import type { CareTask } from '../../types';
import toast from 'react-hot-toast';

const { Title } = Typography;

const TASK_TYPE_OPTIONS = [
  { value: 'WATER_PLANT', label: '💧 Tưới cây ảo' },
  { value: 'BREATHING', label: '🌬️ Thở chậm 1 phút' },
  { value: 'DRINK_WATER', label: '🥤 Uống một ly nước' },
  { value: 'WRITE_JOURNAL', label: '✍️ Viết một dòng nhật ký' },
  { value: 'LISTEN_SOUND', label: '🎵 Nghe âm thanh thư giãn' },
  { value: 'SHORT_WALK', label: '🚶 Đi bộ ngắn' },
];

export default function AdminCareTasks() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CareTask | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['care-tasks'],
    queryFn: async () => {
      const res = await apiClient.get('/care-tasks');
      return res.data;
    },
  });

  const createMut = useMutation({
    mutationFn: (values: Partial<CareTask>) => apiClient.post('/care-tasks', values),
    onSuccess: () => { toast.success('Tạo task thành công'); qc.invalidateQueries({ queryKey: ['care-tasks'] }); setModalOpen(false); },
    onError: () => toast.error('Lỗi khi tạo task'),
  });

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (t: CareTask) => { setEditing(t); form.setFieldsValue(t); setModalOpen(true); };

  const onFinish = (values: Partial<CareTask>) => {
    createMut.mutate(values);
  };

  const columns = [
    {
      title: 'Tiêu đề', dataIndex: 'title', key: 'title',
      render: (v: string) => <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{v}</span>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Loại', dataIndex: 'type', key: 'type',
      render: (v: string) => <Tag>{TASK_TYPE_OPTIONS.find(t => t.value === v)?.label ?? v}</Tag>,
    },
    {
      title: 'Mặc định', dataIndex: 'isDefault', key: 'isDefault',
      render: (v: boolean) => v ? <Tag color="blue">Hệ thống</Tag> : <Tag>Tùy chỉnh</Tag>,
    },
    {
      title: 'Kích hoạt', dataIndex: 'isActive', key: 'isActive',
      render: (v: boolean) => v ? <Tag color="success">Bật</Tag> : <Tag color="default">Tắt</Tag>,
    },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: CareTask) => (
        <Tooltip title="Chỉnh sửa">
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>✅ Nhiệm vụ chăm sóc</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Tạo nhiệm vụ</Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={data?.data ?? []} columns={columns} rowKey="id" loading={isLoading} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title={editing ? '✏️ Sửa nhiệm vụ' : '➕ Tạo nhiệm vụ mới'} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input placeholder="Vd: Tưới cây ảo" />
          </Form.Item>
          <Form.Item name="type" label="Loại nhiệm vụ" rules={[{ required: true }]}>
            <Select options={TASK_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="isDefault" label="Là task hệ thống?" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={createMut.isPending}>
                {editing ? 'Lưu' : 'Tạo'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
