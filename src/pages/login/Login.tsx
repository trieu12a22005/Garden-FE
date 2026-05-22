import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import authApi from '../../apis/auth';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(values);
      setUser(res.user);
      toast.success('Đăng nhập thành công!');
      if (res.user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (res.user.role === 'FARMER') navigate('/farmer/dashboard');
      else navigate('/');
    } catch {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d4f0d4 0%, #a8e0a8 40%, #4ab84a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Card
        style={{
          width: 420,
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(46,168,46,0.2)',
          border: 'none',
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌱</div>
          <Title level={3} style={{ margin: 0, color: 'var(--green-700)', letterSpacing: 1 }}>
            Garden Dashboard
          </Title>
          <Text type="secondary">Đăng nhập để quản lý vườn của bạn</Text>
        </div>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
        )}

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--green-500)' }} />}
              placeholder="Email của bạn"
              style={{ borderRadius: 10, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--green-500)' }} />}
              placeholder="Mật khẩu"
              style={{ borderRadius: 10, height: 48 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 10,
                background: 'var(--green-500)',
                borderColor: 'var(--green-500)',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            🔒 Hệ thống quản lý Garden – Chỉ dành cho Admin & Nhà vườn
          </Text>
        </div>
      </Card>
    </div>
  );
}
