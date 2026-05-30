import {
  Table, Button, Space, Modal, Form, Input, Tag, Typography, Card, Tooltip, Alert,
  Select, InputNumber, DatePicker, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, ClockCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, PlusSquareOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gardenApi } from '../../apis/garden';
import { realPlantApi } from '../../apis/realPlant';
import { flowerTypeApi } from '../../apis/flowerType';
import type { Garden, FlowerType } from '../../types';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

type GardenStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const STATUS_CONFIG: Record<GardenStatus, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING:  { label: 'Chờ duyệt',  icon: <ClockCircleOutlined />,  color: 'warning' },
  APPROVED: { label: 'Đã duyệt',   icon: <CheckCircleOutlined />,  color: 'success' },
  REJECTED: { label: 'Bị từ chối', icon: <CloseCircleOutlined />,  color: 'error'   },
};

export default function FarmerGardens() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Garden | null>(null);
  const [form] = Form.useForm();

  // Batch-add plants state
  const [addPlantModal, setAddPlantModal] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const [addForm] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['farmer-gardens'],
    queryFn: () => gardenApi.getAll(),
  });

  const { data: flowerTypesData } = useQuery({
    queryKey: ['flower-types'],
    queryFn: () => flowerTypeApi.getAll(),
  });

  const flowerTypes: FlowerType[] = flowerTypesData?.data ?? [];

  const addPlantMut = useMutation({
    mutationFn: (values: any) =>
      realPlantApi.batchCreate({
        flowerTypeId: values.flowerTypeId,
        gardenId: selectedGarden!.id,
        quantity: values.quantity,
        plantedAt: values.plantedAt ? dayjs(values.plantedAt).toISOString() : undefined,
      }),
    onSuccess: (res: any) => {
      const count = res?.count ?? res?.data?.length ?? '?';
      toast.success(`✅ Đã thêm ${count} cây vào vườn "${selectedGarden?.name}"`);
      qc.invalidateQueries({ queryKey: ['farmer-gardens'] });
      setAddPlantModal(false);
      addForm.resetFields();
    },
    onError: (err: any) =>
      toast.error(`Lỗi: ${err?.response?.data?.error || err?.response?.data?.message || err.message}`),
  });

  const openAddPlant = (garden: Garden) => {
    setSelectedGarden(garden);
    addForm.resetFields();
    setAddPlantModal(true);
  };

  const createMut = useMutation({
    mutationFn: (values: Partial<Garden>) => gardenApi.create(values),
    onSuccess: () => {
      toast.success('Yêu cầu tạo vườn đã gửi, chờ admin duyệt!');
      qc.invalidateQueries({ queryKey: ['farmer-gardens'] });
      setModalOpen(false);
    },
    onError: () => toast.error('Lỗi khi tạo vườn'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<Garden> }) =>
      gardenApi.update(id, values),
    onSuccess: () => {
      toast.success('Cập nhật vườn thành công');
      qc.invalidateQueries({ queryKey: ['farmer-gardens'] });
      setModalOpen(false);
    },
    onError: () => toast.error('Lỗi khi cập nhật vườn'),
  });

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (g: Garden) => {
    setEditing(g);
    form.setFieldsValue({ name: g.name, address: g.address, description: g.description, imageUrl: g.imageUrl });
    setModalOpen(true);
  };

  const onFinish = (values: Partial<Garden>) => {
    if (editing) updateMut.mutate({ id: editing.id, values });
    else createMut.mutate(values);
  };

  const gardens: Garden[] = data?.data ?? [];

  const columns = [
    {
      title: 'Tên vườn', dataIndex: 'name', key: 'name',
      render: (v: string, record: Garden) => (
        <Button
          type="link"
          style={{ fontWeight: 600, color: 'var(--green-700)', padding: 0 }}
          onClick={() => navigate(`/farmer/gardens/${record.id}`)}
        >
          {v}
        </Button>
      ),
    },
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
          <Tooltip title="Xem chi tiết vườn">
            <Button
              icon={<EyeOutlined />} size="small"
              onClick={() => navigate(`/farmer/gardens/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin">
            <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          {record.status === 'APPROVED' && (
            <Tooltip title="Thêm cây vào vườn">
              <Button
                icon={<PlusSquareOutlined />}
                size="small"
                type="primary"
                style={{ background: 'var(--green-600)', borderColor: 'var(--green-600)' }}
                onClick={() => openAddPlant(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const pending = gardens.filter((g) => g.status === 'PENDING').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>🌿 Vườn của tôi</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Tạo vườn mới
        </Button>
      </div>

      {pending > 0 && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16, borderRadius: 10 }}
          message={`Bạn có ${pending} vườn đang chờ admin duyệt`}
          description="Sau khi được duyệt, bạn có thể thêm cây thật vào vườn."
        />
      )}

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={gardens}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editing ? '✏️ Sửa thông tin vườn' : '➕ Tạo yêu cầu vườn mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={520}
      >
        {!editing && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16, borderRadius: 8 }}
            message="Vườn mới sẽ cần được Admin duyệt trước khi sử dụng"
          />
        )}
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 8 }}>
          <Form.Item name="name" label="Tên vườn" rules={[{ required: true, message: 'Nhập tên vườn' }]}>
            <Input placeholder="Vd: Vườn hoa Đà Lạt" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Địa chỉ vườn" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả về vườn" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Ảnh đại diện (URL)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={createMut.isPending || updateMut.isPending}>
                {editing ? 'Lưu thay đổi' : 'Gửi yêu cầu'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Add Plants Modal ─────────────────────────────────── */}
      <Modal
        title={
          <Space>
            <span style={{ fontSize: 20 }}>🌱</span>
            <span style={{ fontWeight: 700 }}>
              Thêm cây vào vườn: <span style={{ color: 'var(--green-600)' }}>{selectedGarden?.name}</span>
            </span>
          </Space>
        }
        open={addPlantModal}
        onCancel={() => { setAddPlantModal(false); addForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 18,
          marginTop: 8,
          fontSize: 13,
          color: '#555',
        }}>
          🔧 Hệ thống tự động sinh mã QR riêng cho từng cây. Người dùng sẽ chọn loại cây này khi bắt đầu chăm sóc.
        </div>

        <Form form={addForm} layout="vertical" onFinish={addPlantMut.mutate}>
          <Form.Item
            name="flowerTypeId"
            label="🌸 Loại cây / Loại hoa"
            rules={[{ required: true, message: 'Vui lòng chọn loại hoa' }]}
          >
            <Select
              placeholder="Chọn loại hoa..."
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={flowerTypes.map((f) => ({ value: f.id, label: f.name }))}
              optionRender={(opt) => {
                const ft = flowerTypes.find(f => f.id === opt.value);
                return (
                  <Space>
                    <span style={{ fontSize: 18 }}>{ft?.imageUrl ? '🌸' : '🌿'}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{ft?.name}</div>
                      {ft?.defaultDuration && (
                        <div style={{ fontSize: 11, color: '#888' }}>⏱ {ft.defaultDuration} ngày phát triển</div>
                      )}
                    </div>
                  </Space>
                );
              }}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="🔢 Số lượng cây cần thêm"
            rules={[
              { required: true, message: 'Nhập số lượng' },
              { type: 'number', min: 1, max: 500, message: 'Từ 1 đến 500 cây' },
            ]}
            extra="Mỗi cây sẽ có mã riêng. Khi user chọn trồng loại này, số lượng giảm 1."
          >
            <InputNumber
              min={1} max={500}
              style={{ width: '100%' }}
              size="large"
              addonAfter="cây"
              placeholder="Ví dụ: 20"
            />
          </Form.Item>

          <Form.Item name="plantedAt" label="📅 Ngày trồng (tuỳ chọn)">
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              placeholder="Để trống nếu chưa trồng"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Divider />
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setAddPlantModal(false); addForm.resetFields(); }}>Hủy</Button>
              <Button
                type="primary" htmlType="submit"
                loading={addPlantMut.isPending}
                icon={<PlusOutlined />}
                size="large"
                style={{ background: 'var(--green-600)', borderColor: 'var(--green-600)' }}
              >
                Tạo cây
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
