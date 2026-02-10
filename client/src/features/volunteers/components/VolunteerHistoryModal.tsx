import { Modal, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useGetVolunteerHistoryQuery } from '../../../shared/api/api.slice';

interface Props {
  volunteerId: string | null;
  volunteerName: string | null;
  open: boolean;
  onClose: () => void;
}

export const VolunteerHistoryModal = ({ volunteerId, volunteerName, open, onClose }: Props) => {
  const { data, isLoading } = useGetVolunteerHistoryQuery(
    volunteerId || '',
    { skip: !volunteerId || !open }
  );
  const history = data?.data?.history || [];

  const columns = [
    {
      title: 'Event',
      dataIndex: ['opportunityId', 'title'],
      key: 'event'
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
        loading={isLoading} 
      />
    </Modal>
  );
};