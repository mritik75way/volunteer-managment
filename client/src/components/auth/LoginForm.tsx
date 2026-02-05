import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Form, Card, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '../../features/auth/auth.schema';
import api from '../../config/api';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../features/auth/auth.slice';

const { Title, Text } = Typography;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const response = await api.post('/auth/login', data);
    dispatch(setCredentials({
      user: response.data.data.user,
      accessToken: response.data.accessToken,
    }));
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3} className="text-center">Login</Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter your email" size="large" />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Enter your password" size="large" />
              )}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isSubmitting}
            className="mb-4"
          >
            Sign In
          </Button>

          <div className="text-center">
            <Text>Don't have an account? </Text>
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Create Account
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};