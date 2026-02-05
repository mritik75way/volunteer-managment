import { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Divider,
  List,
  Button,
  Tag,
  Space,
  Card,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  NotificationOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../config/api";
import { type Opportunity } from "../../features/opportunities/opportunities.slice";
import { useAppSelector } from "../../store/hooks";

const { Title, Paragraph, Text } = Typography;

interface Announcement {
  _id: string;
  message: string;
  createdAt: string;
  adminId: { name: string };
}

interface Props {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
}

export const OpportunityDetailModal = ({
  opportunity,
  open,
  onClose,
}: Props) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      if (!open || !opportunity?._id) return;

      setAnnLoading(true);
      try {
        const response = await api.get(
          `/opportunities/${opportunity._id}/announcements`,
        );
        if (isMounted) {
          setAnnouncements(response.data.data.announcements);
        }
      } catch {
        if (isMounted) setAnnouncements([]);
      } finally {
        if (isMounted) setAnnLoading(false);
      }
    };

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, [open, opportunity?._id]);

  if (!opportunity) return null;

  const handleEnroll = async (shiftId: string, shiftStartTime: string) => {
    const shiftDay = dayjs(shiftStartTime).format('dddd');
    const userAvailableDays = user?.availability?.map(a => a.day) || [];
    
    if (!userAvailableDays.includes(shiftDay)) {
      Modal.confirm({
        title: 'Availability Mismatch',
        content: `This shift is on ${shiftDay}, which is not in your general availability. Are you sure you want to join?`,
        okText: 'Yes, Join Anyway',
        cancelText: 'Cancel',
        onOk: async () => {
          await api.post(`/opportunities/${opportunity._id}/enroll/${shiftId}`);
          message.success("Successfully joined the shift!");
          onClose();
        }
      });
    } else {
      await api.post(`/opportunities/${opportunity._id}/enroll/${shiftId}`);
      message.success("Successfully joined the shift!");
      onClose();
    }
  };

  return (
    <Modal
      title={opportunity.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <Text type="secondary">
            <EnvironmentOutlined /> {opportunity.location}
          </Text>
          <Paragraph className="mt-2">{opportunity.description}</Paragraph>

          {opportunity.requiredSkills &&
            opportunity.requiredSkills.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  <BulbOutlined /> Required Skills
                </div>
                <Space wrap>
                  {opportunity.requiredSkills.map((skill) => (
                    <Tag key={skill} color="blue" bordered={false}>
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
        </div>

        {announcements.length > 0 && (
          <Card
            size="small"
            className="bg-blue-50 border-blue-100"
            title={
              <Space>
                <NotificationOutlined className="text-blue-500" />
                <span className="text-sm">Latest Updates</span>
              </Space>
            }
          >
            <List
              loading={annLoading}
              itemLayout="vertical"
              dataSource={announcements}
              renderItem={(item) => (
                <List.Item key={item._id}>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <Text strong>{item.adminId?.name || "Admin"}</Text>
                    <Text type="secondary">
                      {dayjs(item.createdAt).format("MMM D, h:mm A")}
                    </Text>
                  </div>
                  <Paragraph className="m-0 text-sm">
                    {item.message}
                  </Paragraph>
                </List.Item>
              )}
            />
          </Card>
        )}

        <Divider className="my-1" />

        <Title level={5}>Available Shifts</Title>
        <List
          dataSource={opportunity.shifts}
          renderItem={(shift) => (
            <List.Item
              extra={
                <Button
                  type="primary"
                  disabled={shift.filled >= shift.capacity}
                  onClick={() => handleEnroll(shift._id, shift.startTime)}
                >
                  {shift.filled >= shift.capacity ? "Full" : "Join Shift"}
                </Button>
              }
            >
              <List.Item.Meta
                title={
                  <Space className="text-sm">
                    <CalendarOutlined />
                    {dayjs(shift.startTime).format("MMM D, h:mm A")} -{" "}
                    {dayjs(shift.endTime).format("h:mm A")}
                  </Space>
                }
                description={
                  <Space className="text-xs">
                    <UserOutlined />
                    <Text>
                      {shift.filled} / {shift.capacity} spots filled
                    </Text>
                    {shift.filled >= shift.capacity && (
                      <Tag color="red" className="m-0">
                        Full
                      </Tag>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
};
