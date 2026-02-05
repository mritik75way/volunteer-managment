import { useEffect, useState } from 'react';
import { Modal, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import api from '../../config/api';

interface Props {
  volunteerId: string | null;
  volunteerName: string | null;
  open: boolean;
  onClose: () => void;
}

export const VolunteerHistoryModal = ({ volunteerId, volunteerName, open, onClose }: Props) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!volunteerId || !open) return;
      setLoading(true);
      try {
        const response = await api.get(`/opportunities/volunteer-history/${volunteerId}`);
        setHistory(response.data.data.history);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [volunteerId, open]);

  const columns = [
    {
      title: 'Event',
      dataIndex: ['opportunityId', 'title'],
      key: 'event',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = { enrolled: 'blue', completed: 'green', cancelled: 'red' };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY')
    }
  ];

  return (
    <Modal
      title={`History for ${volunteerName}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Table 
        dataSource={history} 
        columns={columns} 
        rowKey="_id" 
        loading={loading} 
      />
    </Modal>
  );
};