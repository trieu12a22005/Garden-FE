import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authApi from 'apis/auth';
import { useMutation } from '@tanstack/react-query';

// Định nghĩa schema validation với zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 ký tự hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 ký tự thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Lưu token vào localStorage hoặc context
      localStorage.setItem('token', data.token);
      // Redirect hoặc cập nhật UI sau khi đăng nhập thành công
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Hiển thị lỗi cho người dùng
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                {...register('email')}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : ''
                }`}
                type="email"
                id="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                {...register('password')}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.password ? 'border-red-500' : ''
                }`}
                type="password"
                id="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
