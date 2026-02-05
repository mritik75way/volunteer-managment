import { Spin } from "antd";

export const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
    <Spin size="large" />
  </div>
);
