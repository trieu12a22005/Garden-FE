import {
  Table, Button, Space, Modal, Form, InputNumber,
  Typography, Card, Select, Badge, Image, Statistic, Row, Col, DatePicker, Divider,
} from 'antd';
import {
  PlusOutlined, EyeOutlined, FilterOutlined, ReloadOutlined, ExperimentOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { realPlantApi } from '../../apis/realPlant';
import { gardenApi } from '../../apis/garden';
import { flowerTypeApi } from '../../apis/flowerType';
import type { RealPlant, FlowerType, Garden } from '../../types';
import { PlantStatusTag, PLANT_STATUS_OPTIONS } from '../../components/PlantStatusTag';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function AdminRealPlants() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [gardenFilter, setGardenFilter] = useState<string | undefined>();
  const [flowerFilter, setFlowerFilter] = useState<string | undefined>();

  const [batchModal, setBatchModal] = useState(false);
  const [batchForm] = Form.useForm();

  // ─── Data queries ───────────────────────────────────────────────────
  const { data: plantsData, isLoading } = useQuery({
    queryKey: ['admin-real-plants', statusFilter, gardenFilter, flowerFilter],
    queryFn: () => realPlantApi.getAll({
      ...(statusFilter && { status: statusFilter }),
      ...(gardenFilter && { gardenId: gardenFilter }),
      ...(flowerFilter && { flowerTypeId: flowerFilter }),
    }),
  });

  const { data: gardensData } = useQuery({
    queryKey: ['admin-gardens-select'],
    queryFn: () => gardenApi.getAll({ status: 'APPROVED', limit: 999 }),
  });

  const { data: flowerTypesData } = useQuery({
    queryKey: ['flower-types'],
    queryFn: () => flowerTypeApi.getAll(),
  });

  // ─── Mutations ──────────────────────────────────────────────────────
  const batchCreateMut = useMutation({
    mutationFn: (values: { flowerTypeId: string; gardenId: string; quantity: number; plantedAt?: string }) =>
      realPlantApi.batchCreate(values),
    onSuccess: (res: any) => {
      const count = res?.data?.length ?? res?.count ?? '?';
      toast.success(`✅ Đã tạo ${count} cây thành công!`);
      qc.invalidateQueries({ queryKey: ['admin-real-plants'] });
      setBatchModal(false);
      batchForm.resetFields();
    },
    onError: (err: any) =>
      toast.error(`Lỗi tạo cây: ${err?.response?.data?.error || err?.response?.data?.message || err.message}`),
  });

  const plants: RealPlant[] = plantsData?.data ?? [];
  const gardens: Garden[] = gardensData?.data ?? [];
  const flowerTypes: FlowerType[] = flowerTypesData?.data ?? [];

  // ─── Stats ──────────────────────────────────────────────────────────
  const totalPlants = plants.length;
  const assignedCount = plants.filter(p => p.isAssigned).length;
  const availableCount = plants.filter(p => !p.isAssigned).length;

  // ─── Options ────────────────────────────────────────────────────────
  const gardenOptions = gardens.map((g) => ({ value: g.id, label: g.name }));
  const onBatchFinish = (raw: any) => {
    batchCreateMut.mutate({
      flowerTypeId: raw.flowerTypeId,
      gardenId: raw.gardenId,
      quantity: raw.quantity,
      plantedAt: raw.plantedAt ? raw.plantedAt.toISOString() : undefined,
    });
  };

  // ─── Table columns ──────────────────────────────────────────────────
  const columns = [
    {
      title: 'Mã cây', dataIndex: 'code', key: 'code', width: 140,
      render: (v: string) => <code style={{ color: 'var(--green-700)', fontWeight: 700, fontSize: 13 }}>{v}</code>,
    },
    {
      title: 'Loại hoa', key: 'flowerType',
      render: (_: any, r: RealPlant) => (
        <Space>
          {r.flowerType?.imageUrl
            ? <Image src={r.flowerType.imageUrl} width={28} height={28} style={{ objectFit: 'cover', borderRadius: 6 }} preview={false} />
            : <span style={{ fontSize: 20 }}>🌸</span>}
          <span style={{ fontWeight: 600 }}>{r.flowerType?.name ?? '—'}</span>
        </Space>
      ),
    },
    {
      title: 'Vườn', key: 'garden',
      render: (_: any, r: RealPlant) => (
        <Text style={{ color: 'var(--green-600)' }}>{r.garden?.name ?? '—'}</Text>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (v: any) => <PlantStatusTag status={v} />,
    },
    {
      title: 'Gán cho user', dataIndex: 'isAssigned', key: 'isAssigned',
      render: (v: boolean) => v
        ? <Badge status="success" text="Đã gán" />
        : <Badge status="default" text="Chưa gán" />,
    },
    {
      title: 'Ngày trồng', dataIndex: 'plantedAt', key: 'plantedAt',
      render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : <Text type="secondary">—</Text>,
    },
    {
      title: 'Tạo lúc', dataIndex: 'createdAt', key: 'createdAt',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động', key: 'action', width: 90,
      render: (_: any, record: RealPlant) => (
        <Space>
          <Tooltip title="Xem timeline">
            <Button
              icon={<EyeOutlined />} size="small"
              onClick={() => navigate(`/farmer/real-plants/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>🌿 Quản lý cây thật</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setBatchModal(true)}
          style={{ background: 'var(--green-600)', borderColor: 'var(--green-600)' }}
        >
          Thêm cây vào vườn
        </Button>
      </div>

      {/* Stats row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, borderLeft: '4px solid var(--green-500)' }}>
            <Statistic
              title="Tổng cây"
              value={totalPlants}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: 'var(--green-600)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title="Đã gán người dùng"
              value={assignedCount}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, borderLeft: '4px solid #faad14' }}>
            <Statistic
              title="Chưa gán (còn trống)"
              value={availableCount}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <FilterOutlined style={{ color: 'var(--green-600)' }} />
          <Select
            placeholder="Lọc theo trạng thái"
            options={PLANT_STATUS_OPTIONS}
            allowClear
            onChange={setStatusFilter}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo vườn"
            options={gardenOptions}
            allowClear
            onChange={setGardenFilter}
            style={{ width: 220 }}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            placeholder="Lọc theo loại hoa"
            allowClear
            onChange={setFlowerFilter}
            style={{ width: 220 }}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
            options={flowerTypes.map(f => ({ value: f.id, label: f.name }))}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setStatusFilter(undefined);
              setGardenFilter(undefined);
              setFlowerFilter(undefined);
            }}
          >
            Xoá bộ lọc
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={plants}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15, showTotal: (total) => `Tổng ${total} cây` }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      {/* ── Batch Create Modal ─────────────────────────────────────── */}
      <Modal
        title={
          <Space>
            <span style={{ fontSize: 20 }}>🌱</span>
            <span style={{ fontWeight: 700 }}>Thêm cây vào vườn</span>
          </Space>
        }
        open={batchModal}
        onCancel={() => { setBatchModal(false); batchForm.resetFields(); }}
        footer={null}
        width={520}
      >
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 20,
          marginTop: 8,
        }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            🔧 Hệ thống sẽ tự động tạo mã QR và mã code riêng cho mỗi cây. Sau khi tạo, người dùng có thể được gán vào từng cây để chăm sóc.
          </Text>
        </div>

        <Form form={batchForm} layout="vertical" onFinish={onBatchFinish}>
          <Form.Item
            name="gardenId"
            label="🏡 Vườn"
            rules={[{ required: true, message: 'Vui lòng chọn vườn' }]}
          >
            <Select
              placeholder="Chọn vườn (đã được duyệt)"
              options={gardenOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="flowerTypeId"
            label="🌸 Loại cây / Loại hoa"
            rules={[{ required: true, message: 'Vui lòng chọn loại hoa' }]}
          >
            <Select
              placeholder="Chọn loại hoa"
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={flowerTypes.map(f => ({
                value: f.id,
                label: f.name,
              }))}
              optionRender={(opt) => {
                const ft = flowerTypes.find(f => f.id === opt.value);
                return (
                  <Space>
                    {ft?.imageUrl
                      ? <Image src={ft.imageUrl} width={24} height={24} style={{ objectFit: 'cover', borderRadius: 4 }} preview={false} />
                      : <span>🌸</span>}
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
            label="🔢 Số lượng cây"
            rules={[
              { required: true, message: 'Nhập số lượng cây' },
              { type: 'number', min: 1, max: 500, message: 'Từ 1 đến 500 cây' },
            ]}
          >
            <InputNumber
              min={1}
              max={500}
              style={{ width: '100%' }}
              size="large"
              addonAfter="cây"
              placeholder="Ví dụ: 50"
            />
          </Form.Item>

          <Form.Item
            name="plantedAt"
            label="📅 Ngày trồng (tuỳ chọn)"
          >
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
              <Button onClick={() => { setBatchModal(false); batchForm.resetFields(); }}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={batchCreateMut.isPending}
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
