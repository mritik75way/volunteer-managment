import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../config/api';

const { Title, Text } = Typography;

export const RegisterForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      const payload = { ...values, role: 'volunteer' };
      await api.post('/auth/register', payload);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Title level={2}>Join as a Volunteer</Title>
          <Text type="secondary">Create an account to start contributing</Text>
        </div>
        
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" block size="large">
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account? <Link to="/login">Login now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};