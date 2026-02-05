import { useEffect, useState, useCallback } from 'react';
import { Modal, Table, Select, Avatar, Tag, message, Input, Button, Space,Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import api from '../../config/api';

const { TextArea } = Input;
const {Title} = Typography

interface Volunteer {
  name: string;
  email: string;
}

interface Enrollment {
  _id: string;
  status: 'enrolled' | 'completed' | 'cancelled';
  volunteerId: Volunteer;
}

interface Props {
  opportunityId: string | null;
  open: boolean;
  onClose: () => void;
}

export const ManageEnrollmentsModal = ({ opportunityId, open, onClose }: Props) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [sending, setSending] = useState(false);

  const fetchEnrollments = useCallback(async () => {
    if (!opportunityId) return;
    setLoading(true);
    try {
      const response = await api.get(`/opportunities/${opportunityId}/enrollments`);
      setEnrollments(response.data.data.enrollments);
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    if (open) {
      fetchEnrollments();
    }
  }, [open, fetchEnrollments]);

  const handleStatusChange = async (enrollmentId: string, newStatus: string) => {
    try {
      await api.patch(`/opportunities/enrollments/${enrollmentId}/status`, { status: newStatus });
      message.success('Status updated');
      fetchEnrollments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.trim() || !opportunityId) return;
    setSending(true);
    try {
      await api.post(`/opportunities/${opportunityId}/announcements`, { message: announcement });
      message.success('Announcement broadcasted to all volunteers');
      setAnnouncement('');
    } finally {
      setSending(false);
    }
  };

  const columns: ColumnsType<Enrollment> = [
    {
      title: 'Volunteer',
      dataIndex: 'volunteerId',
      key: 'volunteer',
      render: (volunteer: Volunteer) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{volunteer.name}</div>
            <div className="text-xs text-gray-500">{volunteer.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Current Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = { enrolled: 'blue', completed: 'green', cancelled: 'red' };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { value: 'enrolled', label: 'Enrolled' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      ),
    },
  ];

  return (
    <Modal title="Manage Volunteers & Announcements" open={open} onCancel={onClose} footer={null} width={800}>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Title level={5}>Broadcast Update</Title>
        <Space direction="vertical" className="w-full">
          <TextArea 
            rows={2} 
            placeholder="Important update for all volunteers..." 
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSendAnnouncement} 
            loading={sending}
            disabled={!announcement.trim()}
          >
            Send Announcement
          </Button>
        </Space>
      </div>

      <Table dataSource={enrollments} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 5 }} />
    </Modal>
  );
};