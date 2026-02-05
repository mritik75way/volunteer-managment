import { ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import { router } from './routes';
import { useAppDispatch } from './store/hooks';
import { setCredentials } from './features/auth/auth.slice';
import api from './config/api';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.get('/auth/refresh');
      
        dispatch(setCredentials({
          user: response.data.data.user,
          accessToken: response.data.accessToken,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6366f1',
            fontFamily: "'Inter', sans-serif",
            borderRadius: 8,
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;