import { useState } from 'react';
import { Modal, Input, message } from 'antd';
import api from '../../../config/api';

const { TextArea } = Input;

interface Props {
  opportunityId: string;
  open: boolean;
  onClose: () => void;
}

export const AnnouncementModal = ({ opportunityId, open, onClose }: Props) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.post(`/opportunities/${opportunityId}/announcements`, { message: text });
      message.success('Announcement sent to all volunteers!');
      setText('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Send Update to Volunteers"
      open={open}
      onCancel={onClose}
      onOk={handleSend}
      confirmLoading={loading}
      okText="Send Announcement"
    >
      <TextArea 
        rows={4} 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your update here (e.g., Change in meeting point...)"
      />
    </Modal>
  );
};