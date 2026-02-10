import { ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import { router } from './app/routes';
import { useAppDispatch, useAppSelector } from './app/store/hooks';
import { setCredentials } from './features/auth/auth.slice';
import { apiSlice } from './shared/api/api.slice';
import { ErrorBoundary } from './shared/components/common/ErrorBoundary';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const existingToken = useAppSelector((state) => state.auth.accessToken);
  const [refreshAuth] = apiSlice.endpoints.refresh.useLazyQuery();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (existingToken) {
          setIsLoading(false);
          return;
        }
        
        const result = await refreshAuth(undefined).unwrap();
        dispatch(setCredentials({
          user: result.data.user,
          accessToken: result.accessToken,
        }));
      } catch (error) {
        console.log('No valid session', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, existingToken, refreshAuth]);

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