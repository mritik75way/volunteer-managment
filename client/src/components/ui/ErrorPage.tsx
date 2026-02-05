import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button, Result } from 'antd';

export const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="500"
        title="Oops!"
        subTitle={errorMessage}
        extra={<Button type="primary" href="/">Back Home</Button>}
      />
    </div>
  );
};