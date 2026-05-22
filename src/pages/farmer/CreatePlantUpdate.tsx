import {
  Form, Input, Button, Card, Select, Upload, Typography, Space, Alert, Spin,
} from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { realPlantApi } from '../../apis/realPlant';
import { plantUpdateApi } from '../../apis/plantUpdate';
import { PLANT_STATUS_OPTIONS } from '../../components/PlantStatusTag';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CreatePlantUpdate() {
  const { realPlantId } = useParams<{ realPlantId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');

  const { data: plantData, isLoading } = useQuery({
    queryKey: ['real-plant', realPlantId],
    queryFn: () => realPlantApi.getOne(realPlantId!),
    enabled: !!realPlantId,
  });

  const plant = plantData?.data;

  const mutation = useMutation({
    mutationFn: (values: any) => plantUpdateApi.create({
      realPlantId: realPlantId!,
      imageUrl: imageUrl || values.imageUrl,
      status: values.status,
      note: values.note,
      healthNote: values.healthNote,
    }),
    onSuccess: () => {
      toast.success('Cập nhật cây thành công!');
      navigate('/farmer/real-plants');
    },
    onError: () => toast.error('Lỗi khi cập nhật cây'),
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Title level={4} className="page-title">📸 Cập nhật tình trạng cây</Title>

      {plant && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: 10 }}
          message={`Cây: ${plant.code}`}
          description={`${plant.flowerType?.name ?? ''} — Vườn: ${plant.garden?.name ?? ''}`}
        />
      )}

      <Card style={{ borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={mutation.mutate} size="large">
          <Form.Item label="Ảnh cây (nhập URL)">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="https://... (URL ảnh từ Cloudinary hoặc khác)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ borderRadius: '8px 0 0 8px' }}
              />
            </Space.Compact>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Upload ảnh lên Cloudinary rồi paste URL vào đây
            </Text>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái cây hiện tại"
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái..."
              options={PLANT_STATUS_OPTIONS}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú chung">
            <TextArea rows={3} placeholder="Mô tả tình trạng cây hôm nay..." />
          </Form.Item>

          <Form.Item name="healthNote" label="Ghi chú sức khỏe cây">
            <TextArea rows={2} placeholder="Sức khỏe lá, rễ, độ ẩm đất..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button onClick={() => navigate(-1)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={mutation.isPending}
                disabled={!imageUrl}
              >
                Gửi cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
