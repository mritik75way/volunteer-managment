import {
  SnippetsOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { useGetAdminStatsQuery } from "../../../shared/api/api.slice";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  bg,
  isLoading,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-md">
    <div className={`p-4 rounded-xl ${bg} ${color} text-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-0.5">
        {title}
      </p>
      <div className="text-2xl font-bold text-slate-800">
        {isLoading ? "-" : value}
      </div>
    </div>
  </div>
);

export const AdminStats = () => {
  const { data, isLoading } = useGetAdminStatsQuery(undefined);

  const stats = data?.data?.stats || {
    createdCount: 0,
    activeCount: 0,
    totalHours: 0,
    volunteerCount: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Management Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Opportunities"
            value={stats.createdCount}
            icon={<SnippetsOutlined />}
            color="text-indigo-600"
            bg="bg-indigo-50"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Events"
            value={stats.activeCount}
            icon={<CheckCircleOutlined />}
            color="text-emerald-600"
            bg="bg-emerald-50"
            isLoading={isLoading}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Community Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Hours Contributed"
            value={stats.totalHours}
            icon={<HourglassOutlined />}
            color="text-blue-600"
            bg="bg-blue-50"
            isLoading={isLoading}
          />
          <StatCard
            title="Unique Volunteers"
            value={stats.volunteerCount}
            icon={<TeamOutlined />}
            color="text-violet-600"
            bg="bg-violet-50"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
