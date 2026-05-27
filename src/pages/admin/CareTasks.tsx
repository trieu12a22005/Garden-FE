import {
  Table, Button, Space, Modal, Form, Input, Select, Switch,
  InputNumber, Typography, Card, Tooltip, Tag, Upload, Image, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, PictureOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careTaskApi } from '../../apis/careTask';
import type { CareTask, CareTaskType, VerifyType } from '../../types';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const TASK_TYPE_OPTIONS = [
  { value: 'WATER_PLANT',   label: '💧 Tưới cây ảo' },
  { value: 'BREATHING',     label: '🌬️ Thở chậm 1 phút' },
  { value: 'DRINK_WATER',   label: '🥤 Uống một ly nước' },
  { value: 'WRITE_JOURNAL', label: '✍️ Viết một dòng nhật ký' },
  { value: 'LISTEN_SOUND',  label: '🎵 Nghe âm thanh thư giãn' },
  { value: 'SHORT_WALK',    label: '🚶 Đi bộ ngắn' },
];

const RESOURCE_OPTIONS = [
  { value: 'WATER',      label: '💧 Nước' },
  { value: 'SUNLIGHT',   label: '☀️ Ánh sáng' },
  { value: 'FERTILIZER', label: '🌿 Phân bón' },
  { value: 'AIR',        label: '🌬️ Không khí' },
  { value: 'LOVE',       label: '💚 Tình yêu' },
  { value: 'DEW',        label: '✨ Sương mai' },
];

const VERIFY_OPTIONS = [
  { value: 'SELF_CONFIRM',   label: '✅ Tự xác nhận' },
  { value: 'TIMER',          label: '⏱ Đếm ngược' },
  { value: 'OPTIONAL_PHOTO', label: '📷 Ảnh tuỳ chọn' },
];

const RESOURCE_COLORS: Record<string, string> = {
  WATER: 'blue', SUNLIGHT: 'gold', FERTILIZER: 'green',
  AIR: 'cyan', LOVE: 'pink', DEW: 'purple',
};

export default function AdminCareTasks() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [editing, setEditing] = useState<CareTask | null>(null);
  const [uploadingFor, setUploadingFor] = useState<CareTask | null>(null);
  const [form] = Form.useForm();
  const [verifyType, setVerifyType] = useState<VerifyType>('SELF_CONFIRM');

  const { data, isLoading } = useQuery({
    queryKey: ['care-tasks-admin'],
    queryFn: () => careTaskApi.getAll(),
  });

  const createMut = useMutation({
    mutationFn: (values: any) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null && k !== 'characterImage') fd.append(k, String(v));
      });
      if (values.characterImage?.file) fd.append('image', values.characterImage.file);
      return careTaskApi.create(fd);
    },
    onSuccess: () => { toast.success('Tạo task thành công'); qc.invalidateQueries({ queryKey: ['care-tasks-admin'] }); setModalOpen(false); },
    onError: () => toast.error('Lỗi khi tạo task'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<CareTask> }) => careTaskApi.update(id, values),
    onSuccess: () => { toast.success('Cập nhật thành công'); qc.invalidateQueries({ queryKey: ['care-tasks-admin'] }); setModalOpen(false); },
    onError: () => toast.error('Lỗi khi cập nhật'),
  });

  const uploadImageMut = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => careTaskApi.uploadCharacterImage(id, file),
    onSuccess: () => { toast.success('Upload ảnh thành công'); qc.invalidateQueries({ queryKey: ['care-tasks-admin'] }); setImageModalOpen(false); },
    onError: () => toast.error('Lỗi khi upload'),
  });

  const removeImageMut = useMutation({
    mutationFn: (id: string) => careTaskApi.removeCharacterImage(id),
    onSuccess: () => { toast.success('Đã xóa ảnh'); qc.invalidateQueries({ queryKey: ['care-tasks-admin'] }); },
    onError: () => toast.error('Lỗi khi xóa ảnh'),
  });

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ rewardResource: 'WATER', rewardAmount: 10, growthReward: 5, verifyType: 'SELF_CONFIRM', isDefault: true, isActive: true });
    setVerifyType('SELF_CONFIRM');
    setModalOpen(true);
  };

  const openEdit = (t: CareTask) => {
    setEditing(t);
    form.setFieldsValue(t);
    setVerifyType(t.verifyType);
    setModalOpen(true);
  };

  const onFinish = (values: any) => {
    if (editing) updateMut.mutate({ id: editing.id, values });
    else createMut.mutate(values);
  };

  const columns = [
    {
      title: 'Nhân vật', dataIndex: 'characterImageUrl', key: 'img', width: 72,
      render: (v: string) => v
        ? <Image src={v} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} />
        : <div style={{ width: 48, height: 48, background: '#f0f9f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌿</div>,
    },
    {
      title: 'Tiêu đề', dataIndex: 'title', key: 'title',
      render: (v: string, r: CareTask) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--green-700)' }}>{v}</div>
          {r.description && <Text type="secondary" style={{ fontSize: 12 }}>{r.description}</Text>}
        </div>
      ),
    },
    {
      title: 'Loại', dataIndex: 'type', key: 'type',
      render: (v: CareTaskType) => <Tag>{TASK_TYPE_OPTIONS.find(t => t.value === v)?.label ?? v}</Tag>,
    },
    {
      title: 'Phần thưởng', key: 'reward',
      render: (_: any, r: CareTask) => (
        <Space direction="vertical" size={2}>
          <Tag color={RESOURCE_COLORS[r.rewardResource]}>
            {RESOURCE_OPTIONS.find(o => o.value === r.rewardResource)?.label} +{r.rewardAmount}
          </Tag>
          <Tag color="green">🌱 Tăng trưởng +{r.growthReward}</Tag>
        </Space>
      ),
    },
    {
      title: 'Xác nhận', dataIndex: 'verifyType', key: 'verify',
      render: (v: VerifyType) => {
        const found = VERIFY_OPTIONS.find(o => o.value === v);
        return <Tag>{found?.label ?? v}</Tag>;
      },
    },
    {
      title: 'Trạng thái', key: 'status',
      render: (_: any, r: CareTask) => (
        <Space direction="vertical" size={2}>
          {r.isActive ? <Tag color="success">✅ Bật</Tag> : <Tag>Tắt</Tag>}
          {r.isDefault ? <Tag color="blue">Hệ thống</Tag> : <Tag>Tùy chỉnh</Tag>}
        </Space>
      ),
    },
    {
      title: 'Hành động', key: 'act', width: 120,
      render: (_: any, r: CareTask) => (
        <Space direction="vertical" size={4}>
          <Space>
            <Tooltip title="Sửa"><Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} /></Tooltip>
            <Tooltip title="Ảnh nhân vật">
              <Button icon={<PictureOutlined />} size="small"
                onClick={() => { setUploadingFor(r); setImageModalOpen(true); }}
              />
            </Tooltip>
          </Space>
          {r.characterImageUrl && (
            <Button size="small" danger icon={<DeleteOutlined />}
              onClick={() => Modal.confirm({ title: 'Xóa ảnh nhân vật?', onOk: () => removeImageMut.mutate(r.id) })}
            >
              Xóa ảnh
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>✅ Nhiệm vụ chăm sóc</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Tạo nhiệm vụ</Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={data?.data ?? []} columns={columns} rowKey="id" loading={isLoading}
          pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
      </Card>

      {/* Create / Edit Modal */}
      <Modal title={editing ? '✏️ Sửa nhiệm vụ' : '➕ Tạo nhiệm vụ mới'}
        open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input placeholder="Vd: Tưới cây ảo hôm nay" />
          </Form.Item>
          <Form.Item name="type" label="Loại nhiệm vụ" rules={[{ required: true }]}>
            <Select options={TASK_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider>Phần thưởng</Divider>
          <Space style={{ width: '100%' }} align="start">
            <Form.Item name="rewardResource" label="Loại tài nguyên" style={{ flex: 1 }} rules={[{ required: true }]}>
              <Select options={RESOURCE_OPTIONS} />
            </Form.Item>
            <Form.Item name="rewardAmount" label="Số lượng" rules={[{ required: true }]}>
              <InputNumber min={1} max={999} />
            </Form.Item>
            <Form.Item name="growthReward" label="Điểm tăng trưởng" rules={[{ required: true }]}>
              <InputNumber min={0} max={999} />
            </Form.Item>
          </Space>

          <Divider>Cách xác nhận</Divider>
          <Form.Item name="verifyType" label="Loại xác nhận" rules={[{ required: true }]}>
            <Select options={VERIFY_OPTIONS} onChange={(v) => setVerifyType(v)} />
          </Form.Item>
          {verifyType === 'TIMER' && (
            <Form.Item name="durationSeconds" label="Thời gian đếm ngược">
              <InputNumber min={10} max={3600} addonAfter="giây" style={{ width: '100%' }} />
            </Form.Item>
          )}

          <Divider>Cài đặt</Divider>
          <Space>
            <Form.Item name="isDefault" label="Task hệ thống" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>
          </Space>

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

      {/* Upload character image modal */}
      <Modal title={`🖼 Ảnh nhân vật — ${uploadingFor?.title}`}
        open={imageModalOpen} onCancel={() => setImageModalOpen(false)} footer={null}
      >
        {uploadingFor?.characterImageUrl && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Image src={uploadingFor.characterImageUrl} width={120} style={{ borderRadius: 12 }} />
            <div style={{ marginTop: 8 }}><Text type="secondary">Ảnh hiện tại</Text></div>
          </div>
        )}
        <Upload.Dragger
          accept="image/*"
          showUploadList={false}
          customRequest={({ file }) => {
            if (uploadingFor) uploadImageMut.mutate({ id: uploadingFor.id, file: file as File });
          }}
        >
          <p className="ant-upload-drag-icon"><UploadOutlined /></p>
          <p>Click hoặc kéo thả ảnh vào đây</p>
          <p style={{ color: '#999', fontSize: 12 }}>PNG, JPG, WebP — tối đa 5MB</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
}
