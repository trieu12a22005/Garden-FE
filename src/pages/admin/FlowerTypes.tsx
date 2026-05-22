import {
  Table, Button, Space, Modal, Form, Input, InputNumber, Typography, Card, Tooltip, Image,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowerTypeApi } from '../../apis/flowerType';
import type { FlowerType } from '../../types';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function AdminFlowerTypes() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FlowerType | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['flower-types'],
    queryFn: () => flowerTypeApi.getAll(),
  });

  const createMut = useMutation({
    mutationFn: (values: Partial<FlowerType>) => flowerTypeApi.create(values),
    onSuccess: () => { toast.success('Tạo loại hoa thành công'); qc.invalidateQueries({ queryKey: ['flower-types'] }); setModalOpen(false); },
    onError: () => toast.error('Lỗi khi tạo loại hoa'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<FlowerType> }) => flowerTypeApi.update(id, values),
    onSuccess: () => { toast.success('Cập nhật thành công'); qc.invalidateQueries({ queryKey: ['flower-types'] }); setModalOpen(false); },
    onError: () => toast.error('Lỗi khi cập nhật'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => flowerTypeApi.remove(id),
    onSuccess: () => { toast.success('Đã xóa'); qc.invalidateQueries({ queryKey: ['flower-types'] }); },
    onError: () => toast.error('Lỗi khi xóa'),
  });

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (f: FlowerType) => { setEditing(f); form.setFieldsValue(f); setModalOpen(true); };

  const onFinish = (values: Partial<FlowerType>) => {
    if (editing) updateMut.mutate({ id: editing.id, values });
    else createMut.mutate(values);
  };

  const columns = [
    {
      title: 'Ảnh', dataIndex: 'imageUrl', key: 'imageUrl',
      render: (v: string) => v ? <Image src={v} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} /> : '—',
    },
    {
      title: 'Tên loại hoa', dataIndex: 'name', key: 'name',
      render: (v: string) => <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{v}</span>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Ngày phát triển (dự kiến)', dataIndex: 'defaultDuration', key: 'defaultDuration', render: (v: number) => v ? `${v} ngày` : '—' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => dayjs(v).format('DD/MM/YYYY') },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: FlowerType) => (
        <Space>
          <Tooltip title="Chỉnh sửa"><Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} /></Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<DeleteOutlined />} size="small" danger
              onClick={() => Modal.confirm({
                title: `Xóa loại hoa "${record.name}"?`,
                onOk: () => deleteMut.mutate(record.id),
              })}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>🌸 Quản lý loại hoa</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm loại hoa</Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={data?.data ?? []} columns={columns} rowKey="id" loading={isLoading} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title={editing ? '✏️ Sửa loại hoa' : '➕ Thêm loại hoa'} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={520}>
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Tên loại hoa" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input placeholder="Vd: Hoa hướng dương" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="imageUrl" label="Ảnh đại diện (URL)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="defaultDuration" label="Số ngày phát triển dự kiến">
            <InputNumber min={1} max={365} style={{ width: '100%' }} addonAfter="ngày" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={createMut.isPending || updateMut.isPending}>
                {editing ? 'Lưu thay đổi' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
