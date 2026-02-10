import { useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Space,
  Select,
  message,
} from "antd";
import { UserOutlined, HistoryOutlined, FileExcelOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useGetVolunteersQuery } from "../shared/api/api.slice";
import api from "../config/api";
import { VolunteerHistoryModal } from "../features/volunteers/components/VolunteerHistoryModal";

interface VolunteerData {
  _id: string;
  name: string;
  email: string;
  backgroundCheckStatus: "pending" | "passed" | "failed";
  createdAt: string;
}

export const VolunteersPage = () => {
  const { data, isLoading, refetch } = useGetVolunteersQuery(undefined);
  const volunteers = data?.data?.volunteers || [];

  const [historyModal, setHistoryModal] = useState<{
    open: boolean;
    id: string | null;
    name: string | null;
  }>({
    open: false,
    id: null,
    name: null,
  });

  const handleStatusChange = async (volunteerId: string, status: string) => {
    try {
      await api.patch(`/auth/volunteers/${volunteerId}/background-status`, {
        status,
      });
      message.success("Volunteer status updated");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/auth/export-volunteers", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `volunteers_report_${dayjs().format("YYYY-MM-DD")}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success("Report exported successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to export report");
    }
  };

  const columns: ColumnsType<VolunteerData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-blue-100 text-blue-600"
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Background Check",
      dataIndex: "backgroundCheckStatus",
      key: "backgroundStatus",
      render: (status: string, record: VolunteerData) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { value: "pending", label: "Pending" },
            { value: "passed", label: "Passed" },
            { value: "failed", label: "Failed" },
          ]}
        />
      ),
    },
    {
      title: "Member Since",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<HistoryOutlined />}
            onClick={() =>
              setHistoryModal({
                open: true,
                id: record._id,
                name: record.name,
              })
            }
          >
            History
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-bold text-slate-800 m-0">Community Volunteers</h1>
           <p className="text-slate-500 text-sm">Manage and track volunteer status</p>
        </div>
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />}
          onClick={handleExport}
          className="bg-emerald-600 hover:bg-emerald-500"
        >
          Export Report
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={volunteers}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <VolunteerHistoryModal
        volunteerId={historyModal.id}
        volunteerName={historyModal.name}
        open={historyModal.open}
        onClose={() => setHistoryModal({ open: false, id: null, name: null })}
      />
    </div>
  );
};
