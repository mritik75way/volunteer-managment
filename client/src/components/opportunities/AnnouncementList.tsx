import { useEffect, useState } from "react";
import { List, Typography, Card, Skeleton, Space } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../config/api";

const { Text } = Typography;

interface Announcement {
  _id: string;
  message: string;
  createdAt: string;
  adminId: { name: string };
}

export const AnnouncementList = ({
  opportunityId,
}: {
  opportunityId: string;
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get(
          `/opportunities/${opportunityId}/announcements`,
        );
        setAnnouncements(response.data.data.announcements);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [opportunityId]);

  if (loading) return <Skeleton active />;
  if (announcements.length === 0) return null;

  return (
    <Card
      title={
        <Space>
          <NotificationOutlined /> Latest Updates
        </Space>
      }
      className="shadow-sm border-blue-100"
    >
      <List
        itemLayout="vertical"
        dataSource={announcements}
        renderItem={(item) => (
          <List.Item className="px-0">
            <div className="flex justify-between items-start mb-1">
              <Text strong>{item.adminId.name}</Text>
              <Text type="secondary" className="text-xs">
                {dayjs(item.createdAt).format("MMM D, h:mm A")}
              </Text>
            </div>
            <Text>{item.message}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
};
