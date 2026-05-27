import { Card, Typography, Form, Input, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import authApi from '../apis/auth';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();

  if (!user) return null;

  const onUpdateProfile = async (values: { fullName: string; avatarUrl: string }) => {
    setLoading(true);
    try {
      await authApi.updateProfile(values);
      setUser({ ...user, ...values });
      toast.success('Cập nhật thông tin thành công');
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      return toast.error('Mật khẩu xác nhận không khớp');
    }
    setPasswordLoading(true);
    try {
      await authApi.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      pwdForm.resetFields();
    } catch {
      toast.error('Mật khẩu hiện tại không đúng');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={4} className="page-title"><UserOutlined /> Tài khoản của tôi</Title>

      <Card style={{ borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
        <Avatar
          size={80}
          src={user.avatarUrl}
          icon={!user.avatarUrl && <UserOutlined />}
          style={{ background: 'var(--green-500)', marginBottom: 16 }}
        />
        <div>
          <Title level={5} style={{ margin: 0 }}>{user.fullName || 'Chưa cập nhật tên'}</Title>
          <Text type="secondary">{user.email}</Text>
        </div>
      </Card>

      <Card title="Cập nhật thông tin" style={{ borderRadius: 12, marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={onUpdateProfile} initialValues={user}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatarUrl" label="Link Avatar">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Lưu thông tin</Button>
        </Form>
      </Card>

      <Card title="Đổi mật khẩu" style={{ borderRadius: 12 }}>
        <Form form={pwdForm} layout="vertical" onFinish={onUpdatePassword}>
          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={passwordLoading}>Đổi mật khẩu</Button>
        </Form>
      </Card>
    </div>
  );
}
