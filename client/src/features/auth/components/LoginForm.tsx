import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Form, Card, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '../auth.schema';
import { useAppDispatch } from '../../../app/store/hooks';
import { setCredentials } from '../auth.slice';
import { useLoginMutation } from '../../../shared/api/api.slice';

const { Title, Text } = Typography;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        accessToken: result.accessToken,
      }));
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
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
            loading={isLoading}
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