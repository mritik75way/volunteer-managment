import { Table, Tag, Card, Typography, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ClockCircleOutlined, FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetMyEnrollmentsQuery } from "../../shared/api/api.slice";
import api from "../../config/api";

const { Title, Text } = Typography;

interface ShiftDetails {
  startTime: string;
  endTime: string;
  capacity: number;
}

interface Enrollment {
  _id: string;
  status: "enrolled" | "cancelled" | "completed";
  createdAt: string;
  opportunityId: {
    title: string;
    location: string;
  };
  shiftDetails: ShiftDetails | null;
}

export const MySchedule = () => {
  const { data, isLoading } = useGetMyEnrollmentsQuery(undefined);
  const enrollments = data?.data?.enrollments || [];

  const columns: ColumnsType<Enrollment> = [
    {
      title: "Event",
      dataIndex: ["opportunityId", "title"],
      key: "event",
      render: (text: string) => (
        <span className="font-medium text-blue-700">{text}</span>
      ),
    },
    {
      title: "Certificate",
      key: "certificate",
      render: (_, record: Enrollment) =>
        record.status === "completed" ? (
          <Button
            type="link"
            icon={<FilePdfOutlined />}
            onClick={async () => {
              const response = await api.get(
                `/opportunities/enrollments/${record._id}/certificate`,
                {
                  responseType: "blob",
                },
              );
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `Certificate-${record._id}.pdf`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            Download
          </Button>
        ) : (
          <Text>Not Available</Text>
        ),
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) => {
        if (!record.shiftDetails)
          return <span className="text-gray-400">Shift Removed</span>;
        return (
          <div className="flex flex-col text-sm">
            <Space>
              <ClockCircleOutlined />
              <span className="font-semibold">
                {dayjs(record.shiftDetails.startTime).format("MMM D, YYYY")}
              </span>
            </Space>
            <span className="text-gray-500 ml-5">
              {dayjs(record.shiftDetails.startTime).format("h:mm A")} -{" "}
              {dayjs(record.shiftDetails.endTime).format("h:mm A")}
            </span>
          </div>
        );
      },
    },
    {
      title: "Location",
      dataIndex: ["opportunityId", "location"],
      key: "location",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          enrolled: "blue",
          completed: "green",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Title level={3}>My Volunteer Schedule</Title>
      <Card className="shadow-sm">
        <Table
          dataSource={enrollments}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};
