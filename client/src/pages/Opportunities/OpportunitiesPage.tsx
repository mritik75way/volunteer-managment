import { useState, useMemo } from "react";
import { Button, Table, Tag, Card, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../app/store/hooks";
import { type Opportunity } from "../../features/opportunities/opportunities.slice";
import { useGetOpportunitiesQuery } from "../../shared/api/api.slice";
import { CreateOpportunityModal } from "../../features/opportunities/components/CreateOpportunityModal";
import { OpportunityDetailModal } from "../../features/opportunities/components/OpportunityDetailModal";
import { ManageEnrollmentsModal } from "../../features/opportunities/components/ManageEnrollmentsModal";

const { Title } = Typography;

export const OpportunitiesPage = () => {
  const { data, isLoading } = useGetOpportunitiesQuery(undefined);
  const list = (data?.data?.opportunities || []) as Opportunity[];
  const { user } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [manageId, setManageId] = useState<string | null>(null);

  const columns: ColumnsType<Opportunity> = useMemo(() => [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record: Opportunity) => (
        <Space>
          <span className="font-semibold text-blue-600">{text}</span>
          {!!record.matchScore && record.matchScore > 0 && (
            <Tag color="gold" bordered={false} style={{ fontSize: '10px' }}>
              {record.isBestMatch ? 'BEST MATCH' : `${record.matchScore} SKILLS MATCH`}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <span>
          <EnvironmentOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "open" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created By",
      dataIndex: ["createdBy", "name"],
      key: "createdBy",
    },
    {
      title: "Shifts",
      key: "shifts",
      render: (_, record) => (
        <Space>
          <ClockCircleOutlined />
          {record.shifts.length}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedOpp(record);
              setIsDetailOpen(true);
            }}
            size="small"
          >
            View Details
          </Button>

          {user?.role === "admin" && (
            <Button
              type="text"
              className="text-orange-600 hover:text-orange-700"
              size="small"
              onClick={() => setManageId(record._id)}
            >
              Manage
            </Button>
          )}
        </Space>
      ),
    },
  ], [user?.role]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Volunteer Opportunities</Title>
        {user?.role === "admin" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Opportunity
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={list}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <CreateOpportunityModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <OpportunityDetailModal
        opportunity={selectedOpp}
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOpp(null);
        }}
      />
      <ManageEnrollmentsModal
        opportunityId={manageId}
        open={!!manageId}
        onClose={() => setManageId(null)}
      />
    </div>
  );
};
