import {
  Table, Button, Space, Modal, Form, Input, InputNumber,
  Typography, Card, Tooltip, Image, Tabs, Tag, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  PictureOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowerTypeApi } from '../../apis/flowerType';
import type { FlowerType, PlantStatus } from '../../types';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const STAGE_LABELS: Record<PlantStatus, string> = {
  SEED: 'Hạt giống', SPROUT: 'Nảy mầm', GROWING: 'Đang lớn',
  BUDDING: 'Ra nụ', BLOOMING: 'Nở hoa', RESTING: 'Nghỉ ngơi',
  NEEDS_CARE: 'Cần chăm sóc', COMPLETED: 'Hoàn thành',
};
const GROWTH_STAGES: PlantStatus[] = ['SEED', 'SPROUT', 'GROWING', 'BUDDING', 'BLOOMING'];

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
    onError: () => toast.error('Lỗi khi xóa — có thể đang có cây đang dùng loại hoa này'),
  });

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (f: FlowerType) => {
    setEditing(f);
    form.setFieldsValue({
      ...f,
      stageDurations_SEED: f.stageDurations?.SEED,
      stageDurations_SPROUT: f.stageDurations?.SPROUT,
      stageDurations_GROWING: f.stageDurations?.GROWING,
      stageDurations_BUDDING: f.stageDurations?.BUDDING,
      stageDurations_BLOOMING: f.stageDurations?.BLOOMING,
      stageImages_SEED: f.stageImages?.SEED,
      stageImages_SPROUT: f.stageImages?.SPROUT,
      stageImages_GROWING: f.stageImages?.GROWING,
      stageImages_BUDDING: f.stageImages?.BUDDING,
      stageImages_BLOOMING: f.stageImages?.BLOOMING,
    });
    setModalOpen(true);
  };

  const onFinish = (raw: any) => {
    const stageDurations: any = {};
    const stageImages: any = {};
    GROWTH_STAGES.forEach((s) => {
      if (raw[`stageDurations_${s}`]) stageDurations[s] = raw[`stageDurations_${s}`];
      if (raw[`stageImages_${s}`]) stageImages[s] = raw[`stageImages_${s}`];
    });
    const values: Partial<FlowerType> = {
      name: raw.name, description: raw.description,
      imageUrl: raw.imageUrl, defaultDuration: raw.defaultDuration,
      stageDurations: Object.keys(stageDurations).length ? stageDurations : undefined,
      stageImages: Object.keys(stageImages).length ? stageImages : undefined,
    };
    if (editing) updateMut.mutate({ id: editing.id, values });
    else createMut.mutate(values);
  };

  const columns = [
    {
      title: 'Ảnh', dataIndex: 'imageUrl', key: 'img', width: 70,
      render: (v: string) => v
        ? <Image src={v} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} />
        : <div style={{ width: 48, height: 48, background: '#f0fdf4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌸</div>,
    },
    {
      title: 'Tên', dataIndex: 'name', key: 'name',
      render: (v: string) => <span style={{ fontWeight: 700, color: 'var(--green-700)' }}>{v}</span>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'desc', ellipsis: true },
    {
      title: 'Thời gian', dataIndex: 'defaultDuration', key: 'dur',
      render: (v: number) => v ? <Tag color="green">{v} ngày</Tag> : '—',
    },
    {
      title: 'Giai đoạn (ngày)', key: 'stages',
      render: (_: any, r: FlowerType) => {
        if (!r.stageDurations) return <Text type="secondary">Chưa cấu hình</Text>;
        return (
          <Space size={4} wrap>
            {GROWTH_STAGES.map(s => r.stageDurations?.[s]
              ? <Tag key={s} color="blue">{STAGE_LABELS[s]}: {r.stageDurations[s]}d</Tag>
              : null
            )}
          </Space>
        );
      },
    },
    {
      title: 'Ảnh từng giai đoạn', key: 'stageImgs',
      render: (_: any, r: FlowerType) => {
        const count = r.stageImages ? Object.keys(r.stageImages).length : 0;
        return count > 0
          ? <Tag color="purple">✅ {count}/{GROWTH_STAGES.length} giai đoạn</Tag>
          : <Tag color="default">Chưa có</Tag>;
      },
    },
    { title: 'Tạo lúc', dataIndex: 'createdAt', key: 'ca', render: (v: string) => dayjs(v).format('DD/MM/YYYY') },
    {
      title: 'Hành động', key: 'act', width: 100,
      render: (_: any, r: FlowerType) => (
        <Space>
          <Tooltip title="Chỉnh sửa"><Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} /></Tooltip>
          <Tooltip title="Xóa">
            <Button icon={<DeleteOutlined />} size="small" danger
              onClick={() => Modal.confirm({
                title: `Xóa loại hoa "${r.name}"?`,
                content: 'Không thể xóa nếu đang có cây thật dùng loại hoa này.',
                onOk: () => deleteMut.mutate(r.id),
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
        <Title level={4} style={{ margin: 0 }}>🌸 Quản lý loại hoa</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm loại hoa</Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={data?.data ?? []} columns={columns} rowKey="id" loading={isLoading} pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
      </Card>

      <Modal
        title={editing ? '✏️ Sửa loại hoa' : '➕ Thêm loại hoa'}
        open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={680}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Tabs items={[
            {
              key: 'basic', label: <span><InfoCircleOutlined /> Thông tin cơ bản</span>,
              children: (
                <>
                  <Form.Item name="name" label="Tên loại hoa" rules={[{ required: true, message: 'Nhập tên' }]}>
                    <Input placeholder="Vd: Hoa hướng dương" />
                  </Form.Item>
                  <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  <Form.Item name="imageUrl" label="Ảnh đại diện (URL)">
                    <Input placeholder="https://..." />
                  </Form.Item>
                  <Form.Item name="defaultDuration" label="Tổng số ngày phát triển dự kiến">
                    <InputNumber min={1} max={365} style={{ width: '100%' }} addonAfter="ngày" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'stages', label: <span>⏱ Số ngày mỗi giai đoạn</span>,
              children: (
                <>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    Số ngày cây ở mỗi giai đoạn. App mobile sẽ dùng dữ liệu này để tính giai đoạn theo thời gian thực.
                  </Text>
                  {GROWTH_STAGES.map(s => (
                    <Form.Item key={s} name={`stageDurations_${s}`} label={`${STAGE_LABELS[s]}`}>
                      <InputNumber min={1} max={365} style={{ width: '100%' }} addonAfter="ngày" placeholder="Bỏ trống nếu không dùng" />
                    </Form.Item>
                  ))}
                </>
              ),
            },
            {
              key: 'images', label: <span><PictureOutlined /> Ảnh từng giai đoạn</span>,
              children: (
                <>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    URL ảnh Cloudinary riêng cho từng giai đoạn. Nếu để trống, app sẽ dùng ảnh đại diện chung.
                  </Text>
                  {GROWTH_STAGES.map(s => (
                    <Form.Item key={s} name={`stageImages_${s}`} label={`Ảnh giai đoạn: ${STAGE_LABELS[s]}`}>
                      <Input placeholder="https://res.cloudinary.com/..." />
                    </Form.Item>
                  ))}
                </>
              ),
            },
          ]} />

          <Divider />
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
