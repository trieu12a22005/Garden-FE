import {
  Card, Table, Button, Space, Modal, Form, Select, InputNumber,
  Typography, Tag, Badge, Image, Tooltip, Spin, Empty, Statistic, Row, Col, DatePicker,
} from 'antd';
import {
  PlusOutlined, ArrowLeftOutlined, AppstoreOutlined,
  CheckCircleOutlined, UserOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gardenApi, type PlantTypeSummary } from '../../apis/garden';
import { realPlantApi } from '../../apis/realPlant';
import { flowerTypeApi } from '../../apis/flowerType';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  PENDING:  'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};
const STATUS_LABEL: Record<string, string> = {
  PENDING:  'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

export default function GardenDetail() {
  const { id: gardenId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [addModal, setAddModal] = useState(false);
  const [form] = Form.useForm();

  // Load garden info
  const { data: gardenData, isLoading: loadingGarden } = useQuery({
    queryKey: ['garden', gardenId],
    queryFn: () => gardenApi.getOne(gardenId!),
    enabled: !!gardenId,
  });

  // Load plant summary
  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ['garden-plant-summary', gardenId],
    queryFn: () => gardenApi.getPlantSummary(gardenId!),
    enabled: !!gardenId,
  });

  // Load all flower types (for select in modal)
  const { data: flowersData } = useQuery({
    queryKey: ['flower-types'],
    queryFn: () => flowerTypeApi.getAll(),
  });

  const garden = gardenData?.data;
  const summary: PlantTypeSummary[] = summaryData?.data ?? [];
  const flowerOptions = (flowersData?.data ?? []).map((f: any) => ({
    value: f.id,
    label: f.name,
  }));

  const totalPlants = summary.reduce((s, r) => s + r.total, 0);
  const totalAvailable = summary.reduce((s, r) => s + r.available, 0);
  const totalAssigned = summary.reduce((s, r) => s + r.assigned, 0);

  const addMut = useMutation({
    mutationFn: (values: any) =>
      realPlantApi.batchCreate({
        flowerTypeId: values.flowerTypeId,
        gardenId: gardenId!,
        quantity: values.quantity,
        plantedAt: values.plantedAt ? dayjs(values.plantedAt).format('YYYY-MM-DD') : undefined,
      }),
    onSuccess: (res) => {
      toast.success(`Đã thêm ${res.count} cây vào vườn`);
      qc.invalidateQueries({ queryKey: ['garden-plant-summary', gardenId] });
      setAddModal(false);
      form.resetFields();
    },
    onError: () => toast.error('Lỗi khi thêm cây'),
  });

  const columns = [
    {
      title: 'Loại hoa',
      key: 'flower',
      render: (_: any, record: PlantTypeSummary) => (
        <Space>
          {record.flowerType.imageUrl ? (
            <Image
              src={record.flowerType.imageUrl}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              preview={false}
            />
          ) : (
            <div
              style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'var(--green-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🌸
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--green-700)' }}>{record.flowerType.name}</div>
            {record.flowerType.defaultDuration && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ⏱ {record.flowerType.defaultDuration} ngày
              </Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Tổng số cây',
      dataIndex: 'total',
      key: 'total',
      render: (v: number) => (
        <Tag icon={<AppstoreOutlined />} color="blue">{v} cây</Tag>
      ),
    },
    {
      title: 'Còn trống',
      dataIndex: 'available',
      key: 'available',
      render: (v: number) => (
        <Tag icon={<ClockCircleOutlined />} color={v > 0 ? 'success' : 'default'}>
          {v} chỗ
        </Tag>
      ),
    },
    {
      title: 'Đã có người trồng',
      dataIndex: 'assigned',
      key: 'assigned',
      render: (v: number) => (
        <Tag icon={<UserOutlined />} color="purple">{v} người</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: PlantTypeSummary) => {
        if (record.available === 0)
          return <Badge status="default" text="Hết chỗ" />;
        if (record.available <= 3)
          return <Badge status="warning" text={`Còn ${record.available} chỗ`} />;
        return <Badge status="success" text="Còn chỗ" />;
      },
    },
  ];

  if (loadingGarden) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  if (!garden) {
    return <Empty description="Không tìm thấy vườn" />;
  }

  const isApproved = garden.status === 'APPROVED';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 8 }} />
          <Title level={4} className="page-title" style={{ margin: 0 }}>
            🌿 {garden.name}
          </Title>
          <Space style={{ marginTop: 4 }}>
            <Tag color={STATUS_COLOR[garden.status as string]}>
              {STATUS_LABEL[garden.status as string] ?? garden.status}
            </Tag>
            {garden.address && <Text type="secondary">📍 {garden.address}</Text>}
          </Space>
        </div>
        {isApproved && (
          <Tooltip title={!isApproved ? 'Vườn chưa được duyệt, không thể thêm cây' : ''}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModal(true)}
              disabled={!isApproved}
            >
              Thêm loại cây vào vườn
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Tổng số loại hoa"
              value={summary.length}
              prefix={<span style={{ color: 'var(--green-500)' }}>🌸</span>}
              valueStyle={{ color: 'var(--green-700)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Tổng số cây"
              value={totalPlants}
              prefix={<AppstoreOutlined style={{ color: '#1565c0' }} />}
              valueStyle={{ color: '#1565c0', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Đã có người trồng"
              value={totalAssigned}
              suffix={`/ ${totalPlants}`}
              prefix={<CheckCircleOutlined style={{ color: '#6a1b9a' }} />}
              valueStyle={{ color: '#6a1b9a', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Plant type table */}
      <Card
        title="🌱 Danh sách loại cây trong vườn"
        extra={
          <Text type="secondary" style={{ fontSize: 13 }}>
            Còn trống: <strong style={{ color: 'var(--green-600)' }}>{totalAvailable}</strong> chỗ
          </Text>
        }
        style={{ borderRadius: 12 }}
      >
        {loadingSummary ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : summary.length === 0 ? (
          <Empty
            description={
              <div>
                <p>Vườn chưa có loại cây nào</p>
                {isApproved && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>
                    Thêm loại cây đầu tiên
                  </Button>
                )}
              </div>
            }
          />
        ) : (
          <Table
            dataSource={summary}
            columns={columns}
            rowKey={(r) => r.flowerType.id}
            pagination={false}
            size="middle"
          />
        )}
      </Card>

      {/* Add plant type modal */}
      <Modal
        title="🌱 Thêm loại cây vào vườn"
        open={addModal}
        onCancel={() => { setAddModal(false); form.resetFields(); }}
        footer={null}
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={addMut.mutate} style={{ marginTop: 16 }}>
          <Form.Item
            name="flowerTypeId"
            label="Loại hoa"
            rules={[{ required: true, message: 'Chọn loại hoa' }]}
          >
            <Select
              placeholder="Chọn loại hoa..."
              options={flowerOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng cây cần thêm"
            rules={[{ required: true, message: 'Nhập số lượng' }]}
            extra="Mỗi lần thêm tối đa 100 cây. Khi user chọn trồng cây loại này, số lượng sẽ giảm đi 1."
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: '100%' }}
              placeholder="Vd: 10"
              addonAfter="cây"
            />
          </Form.Item>

          <Form.Item name="plantedAt" label="Ngày bắt đầu trồng (tuỳ chọn)">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setAddModal(false); form.resetFields(); }}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={addMut.isPending}>
                Thêm cây
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
