import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../app/store/hooks";
import clsx from "clsx";

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const navigation = [
    {
      key: "/",
      icon: <DashboardOutlined className="text-xl" />,
      label: "Dashboard",
    },
    {
      key: "/opportunities",
      icon: <CalendarOutlined className="text-xl" />,
      label: "Opportunities",
    },
  ];

  if (user?.role === "volunteer") {
    navigation.push({
      key: "/my-schedule",
      icon: <FileProtectOutlined className="text-xl" />,
      label: "My Schedule",
    });
  }

  if (user?.role === "admin") {
    navigation.push({
      key: "/volunteers",
      icon: <TeamOutlined className="text-xl" />,
      label: "Volunteers",
    });
  }

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-slate-100">
        <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          VolunteerHub
        </h1>
      </div>

      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.key;
          return (
            <Link
              key={item.key}
              to={item.key}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={clsx("transition-colors", isActive ? "text-indigo-600" : "text-slate-400")}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
