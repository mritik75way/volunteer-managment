import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dropdown, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { logout } from "../../../features/auth/auth.slice";
import { useLogoutMutation } from "../../api/api.slice";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const menuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-md"
        >
          <MenuOutlined className="text-xl" />
        </button>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 leading-none">
             Dashboard
          </h2> 
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
          <button className="flex items-center gap-2 group outline-none">
            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors hidden sm:block">
              {user?.name}
            </span>
            <Avatar
              className="bg-indigo-600 border-2 border-transparent group-hover:border-indigo-100 transition-all"
              icon={<UserOutlined />}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </button>
        </Dropdown>
      </div>
    </header>
  );
};
