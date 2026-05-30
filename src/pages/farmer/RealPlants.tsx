import {
  Button, Space, Typography, Card, Select, Input, Badge, Tabs,
  Modal, Form, Image, Spin, Empty, Upload,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  CameraOutlined, EyeOutlined, UploadOutlined,
  SendOutlined, FilterOutlined, ReloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { realPlantApi } from '../../apis/realPlant';
import { gardenApi } from '../../apis/garden';
import { plantUpdateApi } from '../../apis/plantUpdate';
import { uploadImage } from '../../apis/upload';
import type { RealPlant, PlantStatus } from '../../types';
import { PlantStatusTag, PLANT_STATUS_OPTIONS } from '../../components/PlantStatusTag';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

/* ── Stage emoji/color map ─────────────────────────────────── */
const STAGE_META: Record<PlantStatus, { emoji: string; bg: string; border: string; label: string }> = {
  SEED:       { emoji: '🌰', bg: '#fef9c3', border: '#fde047', label: 'Hạt giống' },
  SPROUT:     { emoji: '🌱', bg: '#dcfce7', border: '#86efac', label: 'Nảy mầm' },
  GROWING:    { emoji: '🌿', bg: '#d1fae5', border: '#34d399', label: 'Sinh trưởng' },
  BUDDING:    { emoji: '🌼', bg: '#fef3c7', border: '#fbbf24', label: 'Có nụ' },
  BLOOMING:   { emoji: '🌸', bg: '#fce7f3', border: '#f472b6', label: 'Nở hoa' },
  RESTING:    { emoji: '😴', bg: '#f1f5f9', border: '#94a3b8', label: 'Nghỉ ngơi' },
  NEEDS_CARE: { emoji: '⚠️', bg: '#fee2e2', border: '#f87171', label: 'Cần chăm sóc' },
  COMPLETED:  { emoji: '✅', bg: '#dcfce7', border: '#4ade80', label: 'Hoàn thành' },
};

/* ── Plant Card ─────────────────────────────────────────────── */
function PlantCard({ plant, onUpdate }: { plant: RealPlant; onUpdate: (p: RealPlant) => void }) {
  const navigate = useNavigate();
  const meta = STAGE_META[plant.status] ?? STAGE_META.SEED;
  const imgSrc = plant.flowerType?.stageImages?.[plant.status] ?? plant.flowerType?.imageUrl;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: `2px solid ${meta.border}`,
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.13)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
      }}
    >
      {/* Stage color band */}
      <div style={{ background: meta.bg, padding: '16px 16px 8px', textAlign: 'center', borderBottom: `1px solid ${meta.border}` }}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            width={72} height={72}
            style={{ objectFit: 'cover', borderRadius: 12, border: `2px solid ${meta.border}` }}
            preview={false}
          />
        ) : (
          <div style={{
            width: 72, height: 72, borderRadius: 12, margin: '0 auto',
            background: meta.bg, border: `2px dashed ${meta.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
          }}>
            {meta.emoji}
          </div>
        )}
        <div style={{ marginTop: 8, fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>
          {plant.flowerType?.name ?? '—'}
        </div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
          <code style={{ background: '#f0f0f0', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
            {plant.code}
          </code>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <PlantStatusTag status={plant.status} />
          {plant.isAssigned && <Badge status="success" text={<Text style={{ fontSize: 11 }}>Đã gán</Text>} />}
        </div>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
          🏡 {plant.garden?.name ?? '—'}
        </div>
        {plant.plantedAt && (
          <div style={{ fontSize: 12, color: '#888' }}>
            📅 Trồng: {dayjs(plant.plantedAt).format('DD/MM/YYYY')}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 14px',
        borderTop: '1px solid #f0f0f0', background: '#fafafa',
      }}>
        <Button
          size="small" icon={<EyeOutlined />} style={{ flex: 1 }}
          onClick={() => navigate(`/farmer/real-plants/${plant.id}`)}
        >
          Timeline
        </Button>
        <Button
          size="small" type="primary" icon={<CameraOutlined />} style={{ flex: 1, background: 'var(--green-600)', borderColor: 'var(--green-600)' }}
          onClick={() => onUpdate(plant)}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
}

/* ── Update Modal ──────────────────────────────────────────── */
function UpdateModal({
  plant,
  open,
  onClose,
}: {
  plant: RealPlant | null;
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleClose = () => {
    form.resetFields();
    setImageUrl('');
    onClose();
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: 'image/*',
    showUploadList: false,
    customRequest: async (options) => {
      const file = options.file as File;
      setUploading(true);
      try {
        const res = await uploadImage(file);
        setImageUrl(res.url);
        toast.success('Tải ảnh lên thành công!');
      } catch {
        toast.error('Lỗi tải ảnh, thử lại nhé');
      } finally {
        setUploading(false);
      }
    },
  };

  const submitMut = useMutation({
    mutationFn: (values: any) =>
      plantUpdateApi.create({
        realPlantId: plant!.id,
        imageUrl: imageUrl,
        status: values.status,
        note: values.note,
        healthNote: values.healthNote,
      }),
    onSuccess: () => {
      toast.success(`✅ Đã cập nhật cây ${plant?.code}!`);
      qc.invalidateQueries({ queryKey: ['farmer-real-plants'] });
      handleClose();
    },
    onError: (err: any) =>
      toast.error(`Lỗi: ${err?.response?.data?.error || err?.response?.data?.message || err.message}`),
  });

  const meta = plant ? (STAGE_META[plant.status] ?? STAGE_META.SEED) : STAGE_META.SEED;

  return (
    <Modal
      title={
        <Space>
          <span style={{ fontSize: 20 }}>📸</span>
          <span style={{ fontWeight: 700 }}>
            Cập nhật cây:{' '}
            <span style={{ color: 'var(--green-600)' }}>{plant?.code}</span>
          </span>
        </Space>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
      destroyOnClose
    >
      {plant && (
        <>
          {/* Plant info banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: meta.bg, border: `1px solid ${meta.border}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 20, marginTop: 4,
          }}>
            {plant.flowerType?.imageUrl
              ? <Image src={plant.flowerType.imageUrl} width={44} height={44}
                  style={{ objectFit: 'cover', borderRadius: 8 }} preview={false} />
              : <span style={{ fontSize: 32 }}>{meta.emoji}</span>
            }
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{plant.flowerType?.name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>🏡 {plant.garden?.name}</div>
              <PlantStatusTag status={plant.status} />
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={submitMut.mutate}>

            {/* Image upload */}
            <Form.Item label="📷 Ảnh cây hôm nay" required>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Preview box */}
                <div style={{
                  width: 100, height: 100, borderRadius: 10, flexShrink: 0,
                  border: `2px dashed ${imageUrl ? meta.border : '#d9d9d9'}`,
                  background: imageUrl ? '#f0fdf4' : '#fafafa',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {imageUrl
                    ? <Image src={imageUrl} width={100} height={100}
                        style={{ objectFit: 'cover', borderRadius: 8 }} preview={false} />
                    : <span style={{ fontSize: 28 }}>🖼️</span>
                  }
                </div>

                <div style={{ flex: 1 }}>
                  <Upload {...uploadProps}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={uploading}
                      size="large"
                      style={{ width: '100%', marginBottom: 8 }}
                    >
                      {uploading ? 'Đang tải...' : 'Chọn ảnh từ máy'}
                    </Button>
                  </Upload>
                  {imageUrl && (
                    <div style={{ fontSize: 11, color: 'var(--green-600)' }}>
                      <CheckCircleOutlined /> Ảnh đã tải lên
                    </div>
                  )}
                  {!imageUrl && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Chụp ảnh cây thật và upload lên để ghi lại tình trạng hôm nay
                    </Text>
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="status"
              label="🌿 Trạng thái cây hiện tại"
              initialValue={plant.status}
              rules={[{ required: true, message: 'Chọn trạng thái' }]}
            >
              <Select
                options={PLANT_STATUS_OPTIONS}
                size="large"
                optionRender={(opt) => {
                  const m = STAGE_META[opt.value as PlantStatus];
                  return (
                    <Space>
                      <span>{m?.emoji}</span>
                      <span>{opt.label as string}</span>
                    </Space>
                  );
                }}
              />
            </Form.Item>

            <Form.Item name="note" label="📝 Ghi chú chung">
              <TextArea
                rows={3}
                placeholder="Mô tả tình trạng cây hôm nay... (lá xanh tốt, đã tưới nước, ...)"
              />
            </Form.Item>

            <Form.Item name="healthNote" label="💊 Ghi chú sức khoẻ">
              <TextArea
                rows={2}
                placeholder="Tình trạng lá, rễ, độ ẩm đất, sâu bệnh..."
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
              <Button onClick={handleClose}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                size="large"
                loading={submitMut.isPending}
                disabled={!imageUrl}
                style={{ background: 'var(--green-600)', borderColor: 'var(--green-600)' }}
              >
                Gửi cập nhật
              </Button>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function FarmerRealPlants() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [gardenFilter, setGardenFilter] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'assigned' | 'all'>('assigned');
  const [updateTarget, setUpdateTarget] = useState<RealPlant | null>(null);

  const { data: plantsData, isLoading } = useQuery({
    queryKey: ['farmer-real-plants', statusFilter, gardenFilter],
    queryFn: () => realPlantApi.getAll({
      ...(statusFilter && { status: statusFilter }),
      ...(gardenFilter && { gardenId: gardenFilter }),
    }),
  });

  const { data: gardensData } = useQuery({
    queryKey: ['farmer-gardens'],
    queryFn: () => gardenApi.getAll(),
  });

  const allPlants: RealPlant[] = plantsData?.data ?? [];
  const gardens = gardensData?.data ?? [];

  const filtered = allPlants.filter(p => {
    if (search && !p.code.toLowerCase().includes(search.toLowerCase()) &&
        !p.flowerType?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'assigned' && !p.isAssigned) return false;
    return true;
  });

  const assignedCount = allPlants.filter(p => p.isAssigned).length;
  const gardenOptions = gardens.map((g: any) => ({ value: g.id, label: g.name }));

  const clearFilters = () => {
    setStatusFilter(undefined);
    setGardenFilter(undefined);
    setSearch('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} className="page-title" style={{ margin: 0 }}>🌿 Cây thật của vườn</Title>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as any)}
        style={{ marginBottom: 0 }}
        items={[
          {
            key: 'assigned',
            label: (
              <span>
                👤 Cây đã gán cho người dùng
                <Badge count={assignedCount} style={{ marginLeft: 8, background: 'var(--green-600)' }} />
              </span>
            ),
          },
          {
            key: 'all',
            label: (
              <span>
                🌿 Tất cả cây
                <Badge count={allPlants.length} style={{ marginLeft: 8, background: '#aaa' }} />
              </span>
            ),
          },
        ]}
      />

      {/* Filters */}
      <Card style={{ borderRadius: '0 12px 12px 12px', marginBottom: 20 }}>
        <Space wrap>
          <FilterOutlined style={{ color: 'var(--green-600)' }} />
          <Search
            placeholder="Tìm mã cây hoặc tên hoa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 230 }}
          />
          <Select
            placeholder="Lọc trạng thái"
            options={PLANT_STATUS_OPTIONS}
            value={statusFilter}
            allowClear
            onChange={setStatusFilter}
            style={{ width: 180 }}
          />
          <Select
            placeholder="Lọc theo vườn"
            options={gardenOptions}
            value={gardenFilter}
            allowClear
            onChange={setGardenFilter}
            style={{ width: 200 }}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
          {(search || statusFilter || gardenFilter) && (
            <Button icon={<ReloadOutlined />} onClick={clearFilters}>Xoá lọc</Button>
          )}
        </Space>
      </Card>

      {/* Grid of cards */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : filtered.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>
                {activeTab === 'assigned'
                  ? '👤 Chưa có cây nào được gán cho người dùng'
                  : '🌿 Không tìm thấy cây nào'}
              </p>
              {activeTab === 'assigned' && (
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Cây sẽ xuất hiện ở đây khi người dùng bắt đầu trồng trong app
                </Text>
              )}
            </div>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(plant => (
            <PlantCard key={plant.id} plant={plant} onUpdate={setUpdateTarget} />
          ))}
        </div>
      )}

      {/* Update modal */}
      <UpdateModal
        plant={updateTarget}
        open={!!updateTarget}
        onClose={() => setUpdateTarget(null)}
      />
    </div>
  );
}
